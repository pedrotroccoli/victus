import IMask from 'imask';

export const phoneParser = (value: string) => {
  const masked = IMask.createMask({
    mask: '+0[00] 000000000000000',
  })

  masked.resolve(value);

  return masked.value;
}
