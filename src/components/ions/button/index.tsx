import { ButtonProps as ButtonPropsUI, Button as ButtonUI } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LoaderCircle, LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonPropsUI {
  iconLeft?: LucideIcon;
  iconLeftProps?: React.SVGProps<SVGSVGElement>;
  iconRight?: LucideIcon;
  iconRightProps?: React.SVGProps<SVGSVGElement>;
  loading?: boolean;
}

export const Button = ({ children, iconLeft: LeftIcon, iconLeftProps, iconRight: RightIcon, iconRightProps, loading, disabled, className, ...props }: ButtonProps) => {
  return (
    <ButtonUI {...props} disabled={loading || disabled} className={cn("font-[Recursive] font-medium flex items-center justify-center gap-4", className)}>
      {!loading && LeftIcon && <LeftIcon size={16} strokeWidth={2.5} className='' {...iconLeftProps} />}
      {children}
      {!loading && RightIcon && <RightIcon size={16} strokeWidth={2.5} className='' {...iconRightProps} />}
      {loading && <LoaderCircle size={16} strokeWidth={2.5} className='animate-spin' />}
    </ButtonUI>
  )
}