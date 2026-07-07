const { SELECTORS } = require('../utils/selectors');
const logger = require('../utils/logger');

class ModalPhase {
  constructor(page, log) {
    this.page = page;
    this.logger = log;
  }

  async openModal(tender) {
    try {
      const viewBtn = await this.page.$(SELECTORS.LISTING.VIEW_BUTTON);
      if (!viewBtn) throw new Error('View button not found');
      await viewBtn.click();
      await this.page.waitForTimeout(500);
      logger.info('🔓 Opening modal');
    } catch (error) {
      logger.error('Modal open failed', { error: error.message });
      throw error;
    }
  }

  async waitForStability() {
    const timeout = parseInt(process.env.MODAL_TIMEOUT || '15000');
    const stabilityTime = parseInt(process.env.WAIT_STABILITY_TIME_MS || '1000');
    const stabilityChecks = parseInt(process.env.WAIT_STABILITY_CHECKS || '3');
    const startTime = Date.now();

    let stableCount = 0;

    while (Date.now() - startTime < timeout) {
      try {
        // Check modal visible
        const visible = await this.page.isVisible(SELECTORS.MODAL.CONTAINER);
        if (!visible) throw new Error('Modal not visible');

        // Check no spinner
        const hasSpinner = await this.page.isVisible(SELECTORS.MODAL.SPINNER).catch(() => false);
        if (hasSpinner) {
          stableCount = 0;
          await this.page.waitForTimeout(stabilityTime);
          continue;
        }

        stableCount++;
        if (stableCount >= stabilityChecks) {
          logger.info(`✓ Modal stable (${Date.now() - startTime}ms)`);
          return;
        }

        await this.page.waitForTimeout(stabilityTime);
      } catch (error) {
        stableCount = 0;
        await this.page.waitForTimeout(stabilityTime);
      }
    }

    throw new Error('Modal stability timeout');
  }

  async closeModal() {
    try {
      const closeBtn = await this.page.$(SELECTORS.MODAL.CLOSE_BTN);
      if (closeBtn) {
        await closeBtn.click();
      } else {
        await this.page.keyboard.press('Escape');
      }
      await this.page.waitForTimeout(300);
      logger.info('✓ Modal closed');
    } catch (error) {
      logger.warn('Modal close warning', { error: error.message });
    }
  }
}

module.exports = { ModalPhase };
