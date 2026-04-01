export const numberParser = (value: string | number) => {
  if (typeof value === 'number') return Number(value);

  return Number(value.replace(/\D/g, ''));
}