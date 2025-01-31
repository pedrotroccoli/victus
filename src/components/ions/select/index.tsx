import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select as UiSelect } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SelectProps as UiSelectProps } from "@radix-ui/react-select";

export interface SelectProps extends UiSelectProps {
  label?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  message?: string;
  messageClassName?: string;
  options: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  className?: string;
}

export const Select = ({ iconLeft, iconRight, label, message, messageClassName, options, placeholder, className, ...props }: SelectProps) => {
  return (
    <label className="flex flex-col gap-2">
      {label && <span className="text-sm text-black font-medium">{label}</span>}

      <div className="relative">
        {iconLeft && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {iconLeft}
          </div>
        )}
        <UiSelect {...props}>
          <SelectTrigger className={cn("w-full ring-0 focus:ring-0 hover:border-black", className)}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </UiSelect>

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