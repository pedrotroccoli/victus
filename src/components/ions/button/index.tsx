import { ButtonProps as ButtonPropsUI, Button as ButtonUI } from '@/components/ui/button';
import { LoaderCircle, LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonPropsUI {
  iconLeft?: LucideIcon;
  iconRight?: LucideIcon;
  loading?: boolean;
}

export const Button = ({ children, iconLeft: LeftIcon, iconRight: RightIcon, loading, disabled, ...props }: ButtonProps) => {
  return (
    <ButtonUI {...props} disabled={loading || disabled}>
      {!loading && LeftIcon && <LeftIcon size={16} strokeWidth={1.5} className='' />}
      {children}
      {!loading && RightIcon && <RightIcon size={16} strokeWidth={1.5} className='' />}
      {loading && <LoaderCircle size={16} strokeWidth={1.5} className='animate-spin' />}
    </ButtonUI>
  )
}