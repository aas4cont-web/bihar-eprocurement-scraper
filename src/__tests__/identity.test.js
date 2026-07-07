// src/__tests__/identity.test.js
const { IdentityVerifier } = require('../scraper/identity');

describe('IdentityVerifier', () => {
  test('IdentityVerifier initializes', () => {
    const mockPage = {};
    const mockLogger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
    const verifier = new IdentityVerifier(mockPage, mockLogger);
    expect(verifier).toBeDefined();
  });

  test('compareIdentity matches on 2+ fields', () => {
    const verifier = new IdentityVerifier({}, {});
    const expected = {
      tender_number: 'TN123',
      reference_number: 'REF456',
      department: 'PWD',
      description: 'Road Construction',
    };
    const actual = {
      tender_number: 'TN123',
      reference: 'REF456',
      department: 'PWD',
      description: 'Different',
    };
    expect(verifier.compareIdentity(expected, actual)).toBe(true);
  });
});
