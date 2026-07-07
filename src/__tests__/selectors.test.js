// src/__tests__/selectors.test.js
const { SELECTORS } = require('../utils/selectors');

describe('Selectors', () => {
  test('SELECTORS.LISTING exists', () => {
    expect(SELECTORS.LISTING).toBeDefined();
    expect(SELECTORS.LISTING.TABLE).toBeDefined();
  });

  test('SELECTORS.MODAL exists', () => {
    expect(SELECTORS.MODAL).toBeDefined();
    expect(SELECTORS.MODAL.CONTAINER).toBeDefined();
  });

  test('SELECTORS.FINANCIAL exists', () => {
    expect(SELECTORS.FINANCIAL).toBeDefined();
    expect(SELECTORS.FINANCIAL.EMD).toBeDefined();
  });
});
