// src/__tests__/parser.test.js
const { ParserPhase } = require('../scraper/parser');

describe('ParserPhase', () => {
  test('ParserPhase initializes', () => {
    const mockPage = {};
    const mockLogger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
    const parser = new ParserPhase(mockPage, mockLogger);
    expect(parser).toBeDefined();
  });
});
