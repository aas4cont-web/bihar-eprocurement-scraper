const SELECTORS = {
  LISTING: {
    TABLE: 'table.tender-table',
    TABLE_ROW: 'table.tender-table tbody tr',
    VIEW_BUTTON: 'button[title="View Details"], a.view-link',
  },
  MODAL: {
    CONTAINER: '#tender-modal, .modal-dialog',
    CLOSE_BTN: '.modal-close, [aria-label="Close"]',
    SPINNER: '.spinner, .loading, .modal-spinner',
  },
  FINANCIAL: {
    EMD: 'label:contains("EMD") ~ span, [ng-bind*="emd"]',
    TENDER_FEE: 'label:contains("Tender Fee") ~ span, [ng-bind*="tenderFee"]',
    PROCESSING_FEE: 'label:contains("Processing Fee") ~ span, [ng-bind*="processingFee"]',
  },
  DATES: {
    PUBLISH: 'label:contains("Publish") ~ span, [ng-bind*="publishDate"]',
    SUBMIT_START: 'label:contains("Submission Start") ~ span, [ng-bind*="submissionStart"]',
    SUBMIT_END: 'label:contains("Submission End") ~ span, [ng-bind*="submissionEnd"]',
    OPENING: 'label:contains("Opening") ~ span, [ng-bind*="openingDate"]',
  },
};

const getText = (page, selector) => {
  return page.$eval(selector, (el) => (el ? el.textContent.trim() : '')).catch(() => '');
};

module.exports = { SELECTORS, getText };
