const playwright = require('playwright');
const logger = require('../utils/logger');

class BrowserManager {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    try {
      const headless = process.env.HEADLESS !== 'false';
      this.browser = await playwright.chromium.launch({ headless });
      this.page = await this.browser.newPage({
        viewport: {
          width: parseInt(process.env.VIEWPORT_WIDTH || '1920'),
          height: parseInt(process.env.VIEWPORT_HEIGHT || '1080'),
        },
      });

      this.page.setDefaultTimeout(parseInt(process.env.BROWSER_TIMEOUT || '30000'));
      logger.info('✅ Browser initialized');
    } catch (error) {
      logger.error('Browser initialization failed', { error: error.message });
      throw error;
    }
  }

  async close() {
    try {
      if (this.page) await this.page.close();
      if (this.browser) await this.browser.close();
      logger.info('✅ Browser closed');
    } catch (error) {
      logger.error('Browser close failed', { error: error.message });
    }
  }
}

module.exports = { BrowserManager };
