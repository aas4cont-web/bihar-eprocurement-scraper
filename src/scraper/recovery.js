const logger = require('../utils/logger');

class RecoveryManager {
  constructor(page, log) {
    this.page = page;
    this.logger = log;
  }

  async executeRecoveryLadder(level) {
    try {
      switch (level) {
        case 1:
          this.logger.info('🔄 Recovery L1: Close modal');
          await this.page.keyboard.press('Escape');
          break;
        case 2:
          this.logger.info('🔄 Recovery L2: Clear DOM');
          await this.page.evaluate(() => {
            const modals = document.querySelectorAll('[role="dialog"], .modal');
            modals.forEach((m) => m.remove());
          });
          break;
        case 3:
          this.logger.info('🔄 Recovery L3: Reload page');
          await this.page.reload({ waitUntil: 'domcontentloaded' });
          break;
        default:
          this.logger.info('🔄 Recovery: Wait');
          await this.page.waitForTimeout(2000);
      }
    } catch (error) {
      this.logger.warn('Recovery step failed', { error: error.message });
    }
  }
}

module.exports = { RecoveryManager };
