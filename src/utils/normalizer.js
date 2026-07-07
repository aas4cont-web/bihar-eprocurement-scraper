/**
 * Normalize financial amounts and dates from portal
 */

function normalizeAmount(str) {
  if (!str) return { raw: str, normalized: null };
  const raw = str;
  const cleaned = str.replace(/[₹Rs.\s,]/g, '').trim();
  const normalized = parseInt(cleaned, 10) || null;
  return { raw, normalized };
}

function normalizeDate(str) {
  if (!str) return { raw: str, normalized: null };
  const raw = str;
  let normalized = null;

  // Try DD/MM/YYYY
  const ddmmyyyy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(str);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    const date = new Date(year, month - 1, day);
    if (!isNaN(date)) {
      normalized = date.toISOString().split('T')[0];
    }
  }

  // Try YYYY-MM-DD
  if (!normalized && /^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const date = new Date(str);
    if (!isNaN(date)) {
      normalized = str;
    }
  }

  // Try DD Month YYYY
  if (!normalized) {
    const months = {
      january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
      july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
    };
    const pattern = /^(\d{1,2})\s+(\w+)\s+(\d{4})$/i;
    const match = pattern.exec(str);
    if (match) {
      const [, day, monthName, year] = match;
      const month = months[monthName.toLowerCase()];
      if (month) {
        const date = new Date(year, month - 1, day);
        if (!isNaN(date)) {
          normalized = date.toISOString().split('T')[0];
        }
      }
    }
  }

  return { raw, normalized };
}

module.exports = { normalizeAmount, normalizeDate };
