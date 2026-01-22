export const phoneValidator = (value: string) => {
  // International format: +XX followed by 6-14 digits (with optional spaces/dashes)
  const internationalPhoneRegex = /^\+\d{1,3}[\s-]?\d{6,14}$/;

  // Remove spaces and dashes for digit count validation
  const digitsOnly = value.replace(/[\s-]/g, '');
  const hasValidLength = digitsOnly.length >= 8 && digitsOnly.length <= 17;

  return internationalPhoneRegex.test(value) && hasValidLength;
}
