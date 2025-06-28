let currentRules = {
  requiredFields: ['name', 'nationality', 'id', 'expiration'],
  validNationalities: ['Arstotzka'],
  expirationDate: '2025-12-31', // Documents must not expire before this date
};

function generateDocument() {
  const names = ['John Doe', 'Jane Smith', 'Peter Jones', 'Maria Garcia'];
  const nationalities = ['Arstotzka', 'Obristan', 'Republia', 'United Federation'];
  const ids = ['ABC12345', 'DEF67890', 'GHI11223', 'JKL44556'];
  const expirations = ['2025-12-31', '2026-06-15', '2024-11-01', '2027-03-20'];

  // Introduce some invalid documents for testing
  const isValid = Math.random() > 0.3; // 70% chance of being valid based on current rules

  let doc = {
    name: names[Math.floor(Math.random() * names.length)],
    nationality: isValid ? 'Arstotzka' : nationalities[Math.floor(Math.random() * nationalities.length)],
    id: ids[Math.floor(Math.random() * ids.length)],
    expiration: isValid ? '2026-06-15' : expirations[Math.floor(Math.random() * expirations.length)],
    imageUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${names[Math.floor(Math.random() * names.length)]}`,
  };

  // Ensure some documents are invalid by missing a field
  if (Math.random() < 0.1 && isValid) { // 10% chance of missing a field for valid docs
    const fieldToRemove = currentRules.requiredFields[Math.floor(Math.random() * currentRules.requiredFields.length)];
    delete doc[fieldToRemove];
  }

  return doc;
}

function verifyDocument(document) {
  let reasons = [];

  // Check required fields
  currentRules.requiredFields.forEach(field => {
    if (!document[field]) {
      reasons.push(`Missing field: ${field}`);
    }
  });

  // Check nationality
  if (document.nationality && !currentRules.validNationalities.includes(document.nationality)) {
    reasons.push(`Invalid nationality: ${document.nationality}`);
  }

  // Check expiration date
  if (document.expiration && new Date(document.expiration) < new Date(currentRules.expirationDate)) {
    reasons.push(`Document expired: ${document.expiration}`);
  }

  if (reasons.length === 0) {
    return { isValid: true, reasons: [] };
  } else {
    return { isValid: false, reasons: reasons };
  }
}

module.exports = {
  currentRules,
  generateDocument,
  verifyDocument,
};