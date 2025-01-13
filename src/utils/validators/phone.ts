export const phoneValidator = (value: string) => {
  const brazilianPhoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

  return brazilianPhoneRegex.test(value);
}
