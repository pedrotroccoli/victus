import { Input as UiInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  message?: string;
  messageClassName?: string;
}

export const Input = ({ iconLeft, iconRight, className, label, message, messageClassName, ...props }: InputProps) => {
  return (
    <label className="flex flex-col gap-2">
      {label && <span className="text-sm text-black font-medium">{label}</span>}

      <div className="relative">
        {iconLeft && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {iconLeft}
          </div>
        )}
        <UiInput {...props} className={cn('hover:bg-neutral-100', iconLeft ? "pl-10" : "", iconRight ? "pr-10" : "", className)} />

        {iconRight && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {iconRight}
          </div>
        )}
      </div>

      {message && <span className={cn("text-xs", messageClassName)}>{message}</span>}
    </label>
  )
}