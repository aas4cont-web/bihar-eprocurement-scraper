const { SELECTORS, getText } = require('../utils/selectors');
const { normalizeAmount, normalizeDate } = require('../utils/normalizer');
const logger = require('../utils/logger');

class ParserPhase {
  constructor(page, log) {
    this.page = page;
    this.logger = log;
  }

  async parse() {
    try {
      const emd = normalizeAmount(await getText(this.page, SELECTORS.FINANCIAL.EMD));
      const tender_fee = normalizeAmount(await getText(this.page, SELECTORS.FINANCIAL.TENDER_FEE));
      const processing_fee = normalizeAmount(await getText(this.page, SELECTORS.FINANCIAL.PROCESSING_FEE));

      const publish_date = normalizeDate(await getText(this.page, SELECTORS.DATES.PUBLISH));
      const submission_start = normalizeDate(await getText(this.page, SELECTORS.DATES.SUBMIT_START));
      const submission_end = normalizeDate(await getText(this.page, SELECTORS.DATES.SUBMIT_END));
      const opening_date = normalizeDate(await getText(this.page, SELECTORS.DATES.OPENING));

      this.logger.info('✅ Parse complete', {
        emd: emd.normalized,
        tender_fee: tender_fee.normalized,
        processing_fee: processing_fee.normalized,
      });

      return { emd, tender_fee, processing_fee, publish_date, submission_start, submission_end, opening_date };
    } catch (error) {
      this.logger.error('Parse failed', { error: error.message });
      throw error;
    }
  }
}

module.exports = { ParserPhase };
