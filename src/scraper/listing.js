const { SELECTORS } = require('../utils/selectors');
const logger = require('../utils/logger');

class ListingPhase {
  constructor(page, log) {
    this.page = page;
    this.logger = log;
  }

  async extract() {
    try {
      await this.page.waitForSelector(SELECTORS.LISTING.TABLE_ROW, { timeout: 10000 });

      const tenders = await this.page.evaluate(() => {
        const rows = document.querySelectorAll('table.tender-table tbody tr');
        const tenderList = [];

        rows.forEach((row, index) => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 4) {
            tenderList.push({
              tender_number: cells[0]?.textContent?.trim() || '',
              reference_number: cells[1]?.textContent?.trim() || '',
              department: cells[2]?.textContent?.trim() || '',
              description: cells[3]?.textContent?.trim() || '',
              row_index: index,
            });
          }
        });

        return tenderList;
      });

      this.logger.info(`📋 Extracted ${tenders.length} tenders from listing`);
      return tenders;
    } catch (error) {
      this.logger.error('Listing extraction failed', { error: error.message });
      throw error;
    }
  }
}

module.exports = { ListingPhase };
