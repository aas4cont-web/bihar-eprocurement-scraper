const { normalizeAmount, normalizeDate } = require('../utils/normalizer');

describe('Normalizer', () => {
  test('normalizeAmount with Indian format', () => {
    const result = normalizeAmount('₹5,00,000');
    expect(result.normalized).toBe(500000);
  });

  test('normalizeAmount with Rs. prefix', () => {
    const result = normalizeAmount('Rs. 100000');
    expect(result.normalized).toBe(100000);
  });

  test('normalizeAmount handles empty string', () => {
    const result = normalizeAmount('');
    expect(result.normalized).toBeNull();
  });

  test('normalizeDate DD/MM/YYYY format', () => {
    const result = normalizeDate('07/07/2026');
    expect(result.normalized).toBe('2026-07-07');
  });

  test('normalizeDate YYYY-MM-DD format', () => {
    const result = normalizeDate('2026-07-07');
    expect(result.normalized).toBe('2026-07-07');
  });

  test('normalizeDate handles invalid dates', () => {
    const result = normalizeDate('invalid');
    expect(result.normalized).toBeNull();
  });

  test('normalizeDate returns raw value', () => {
    const result = normalizeDate('07/07/2026');
    expect(result.raw).toBe('07/07/2026');
  });
});
