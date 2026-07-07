const logger = require('../utils/logger');

class IdentityVerifier {
  constructor(page, log) {
    this.page = page;
    this.logger = log;
  }

  async verify(expectedTender) {
    try {
      const modalText = await this.page.textContent('#tender-modal, .modal-dialog, [role="dialog"]');

      const tenderNumberMatch = modalText.includes(expectedTender.tender_number);
      const referenceMatch = modalText.includes(expectedTender.reference_number);
      const departmentMatch = modalText.includes(expectedTender.department);

      const matchCount = [tenderNumberMatch, referenceMatch, departmentMatch].filter(Boolean).length;

      if (matchCount >= 2) {
        this.logger.info('✅ Identity verified');
        return true;
      }

      this.logger.warn('❌ Identity mismatch', {
        expected: expectedTender.tender_number,
        matches: matchCount,
      });
      return false;
    } catch (error) {
      this.logger.error('Identity verification error', { error: error.message });
      return false;
    }
  }

  compareIdentity(expected, actual) {
    const fields = ['tender_number', 'reference_number', 'department', 'description'];
    let matches = 0;

    for (const field of fields) {
      if (expected[field] && actual[field]) {
        if (
          expected[field].toLowerCase().includes(actual[field].toLowerCase()) ||
          actual[field].toLowerCase().includes(expected[field].toLowerCase())
        ) {
          matches++;
        }
      }
    }

    return matches >= 2;
  }
}

module.exports = { IdentityVerifier };
