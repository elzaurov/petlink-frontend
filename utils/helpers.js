import parsePhoneNumber from 'libphonenumber-js';
export function getAbbreviation(fullName) {
  const words = fullName.split(' ');
  let abbreviation = '';

  words.forEach((word) => {
    abbreviation += word.charAt(0);
  });

  return abbreviation.toUpperCase();
}

export function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

export function formatPhoneNumber(number) {
  const parsed = parsePhoneNumber(number, 'NO');
  return parsed.formatNational();
}
