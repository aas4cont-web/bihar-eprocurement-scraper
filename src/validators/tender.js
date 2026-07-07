// src/validators/tender.js
const { tenderSchema } = require('./schema');
const logger = require('../utils/logger');

class TenderValidator {
  async validate(tender) {
    try {
      await tenderSchema.validateAsync(tender);
      return { valid: true, errors: [] };
    } catch (error) {
      logger.warn('Validation error', { error: error.message });
      return { valid: false, errors: [error.message] };
    }
  }
}

module.exports = { TenderValidator };
