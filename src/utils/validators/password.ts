export const passwordLengthValidator = (password: string) => {
  if (!password) return false;

  return password && password.length >= 8
}

export const passwordNumberValidator = (password: string) => {
  return password && /\d/.test(password)
}

export const passwordUpperCaseValidator = (password: string) => {
  return password && /[A-Z]/.test(password)
}

export const passwordLowerCaseValidator = (password: string) => {
  return password && /[a-z]/.test(password)
}

export const passwordSpecialCharacterValidator = (password: string) => {
  return password && /[!@#$%^&*]/.test(password)
}

export function evaluatePasswordStrength(password: string) {
  let score = 0;

  if (!password) return score;

  if (passwordLengthValidator(password)) score += 1;
  if (passwordLowerCaseValidator(password)) score += 1;
  if (passwordUpperCaseValidator(password)) score += 1;
  if (passwordNumberValidator(password)) score += 1;
  if (passwordSpecialCharacterValidator(password)) score += 1;

  return score;
}