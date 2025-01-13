import IMask from 'imask';



export const phoneParser = (value: string) => {
  const masked = IMask.createMask({
    mask: '(00) 00000-0000',
  })

  masked.resolve(value);

  return masked.value;
}
