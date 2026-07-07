const crypto = require('crypto');

function generateFingerprint(data) {
  const combined = `${data.emd}|${data.tender_fee}|${data.processing_fee}`;
  return crypto.createHash('sha256').update(combined).digest('hex');
}

function generateIdentityFingerprint(data) {
  const combined = `${data.tender_number}|${data.reference_number}|${data.department}`;
  return crypto.createHash('sha256').update(combined).digest('hex');
}

module.exports = { generateFingerprint, generateIdentityFingerprint };
