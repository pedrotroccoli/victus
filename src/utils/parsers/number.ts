export const numberParser = (value: string) => {
  return Number(value.replace(/\D/g, ''));
}