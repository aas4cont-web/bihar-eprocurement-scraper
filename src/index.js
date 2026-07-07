/**
 * Main entry point for Bihar eProcurement Scraper
 */

require('dotenv').config();
const logger = require('./utils/logger');
const { BrowserManager } = require('./browser/manager');
const { ListingPhase } = require('./scraper/listing');
const { ModalPhase } = require('./scraper/modal');
const { IdentityVerifier } = require('./scraper/identity');
const { ParserPhase } = require('./scraper/parser');
const { TenderValidator } = require('./validators/tender');
const { Database } = require('./db/connection');
const { RecoveryManager } = require('./scraper/recovery');

class ScraperPipeline {
  constructor() {
    this.browserManager = new BrowserManager();
    this.database = new Database();
    this.validator = new TenderValidator();
    this.metrics = {
      totalFound: 0,
      successfullyScrapped: 0,
      validationFailures: 0,
      parseFailures: 0,
      identityMismatches: 0,
      staleContent: 0,
      totalRetries: 0,
      startTime: null,
    };
  }

  async run() {
    try {
      this.metrics.startTime = Date.now();
      logger.info('🚀 Starting Bihar eProcurement Scraper');

      // Initialize browser
      await this.browserManager.init();
      const page = this.browserManager.page;

      // Connect to database
      await this.database.connect();

      // Navigate to portal
      const portalUrl = process.env.PORTAL_URL || 'https://bihar-eprocurement.portal.gov.in';
      await page.goto(portalUrl, { waitUntil: 'domcontentloaded' });
      logger.info('📄 Portal loaded', { url: portalUrl });

      // Extract listings
      const listingPhase = new ListingPhase(page, logger);
      const tenders = await listingPhase.extract();
      this.metrics.totalFound = tenders.length;
      logger.info(`📋 Found ${tenders.length} tenders`);

      // Process each tender
      for (let i = 0; i < tenders.length; i++) {
        const tender = tenders[i];
        let retries = 0;
        const maxRetries = parseInt(process.env.MAX_RETRIES || '3');

        while (retries <= maxRetries) {
          try {
            logger.info(`⏳ Processing tender ${i + 1}/${tenders.length}`, {
              tenderNumber: tender.tender_number,
              reference: tender.reference_number,
              retry: retries,
            });

            // Modal phase
            const modalPhase = new ModalPhase(page, logger);
            await modalPhase.openModal(tender);
            await modalPhase.waitForStability();

            // Identity verification
            const verifier = new IdentityVerifier(page, logger);
            const verified = await verifier.verify(tender);
            if (!verified) {
              this.metrics.identityMismatches++;
              await modalPhase.closeModal();
              throw new Error('Identity verification failed');
            }

            // Parse data
            const parser = new ParserPhase(page, logger);
            const data = await parser.parse();
            Object.assign(data, {
              tender_number: tender.tender_number,
              reference_number: tender.reference_number,
              department: tender.department,
              description: tender.description,
            });

            // Validate
            const validation = await this.validator.validate(data);
            if (!validation.valid) {
              this.metrics.validationFailures++;
              await modalPhase.closeModal();
              throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
            }

            // Store in database
            const result = await this.database.storeTender(data);
            if (result) {
              this.metrics.successfullyScrapped++;
            }

            // Close modal and move to next
            await modalPhase.closeModal();
            await page.waitForTimeout(500);
            break; // Exit retry loop on success
          } catch (error) {
            retries++;
            this.metrics.totalRetries++;
            logger.warn(`❌ Tender processing failed (retry ${retries}/${maxRetries})`, {
              error: error.message,
              tender: tender.tender_number,
            });

            if (retries <= maxRetries) {
              const recovery = new RecoveryManager(page, logger);
              await recovery.executeRecoveryLadder(retries);
            } else {
              this.metrics.parseFailures++;
              break;
            }
          }
        }
      }

      // Final report
      const runtime = (Date.now() - this.metrics.startTime) / 1000;
      logger.info('✅ Scraping completed', {
        totalFound: this.metrics.totalFound,
        successfully_scraped: this.metrics.successfullyScrapped,
        validation_failures: this.metrics.validationFailures,
        parse_failures: this.metrics.parseFailures,
        identity_mismatches: this.metrics.identityMismatches,
        stale_content: this.metrics.staleContent,
        total_retries: this.metrics.totalRetries,
        runtime_seconds: runtime.toFixed(2),
      });
    } catch (error) {
      logger.error('Pipeline failed', { error: error.message });
      throw error;
    } finally {
      await this.browserManager.close();
      await this.database.disconnect();
    }
  }
}

// Run pipeline
if (require.main === module) {
  const pipeline = new ScraperPipeline();
  pipeline
    .run()
    .catch((error) => {
      logger.error('Fatal error', { error: error.message });
      process.exit(1);
    });
}

module.exports = { ScraperPipeline };
