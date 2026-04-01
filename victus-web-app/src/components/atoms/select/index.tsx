import { FieldWrapper, FieldWrapperProps } from "@/components/ions/form-field-wrapper";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select as UiSelect } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SelectProps as UiSelectProps } from "@radix-ui/react-select";

export interface SelectProps extends Omit<FieldWrapperProps, 'children'>, UiSelectProps {
  options: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
}

export const Select = ({ iconLeft, iconRight, label, message, messageClassName, options, placeholder, className, wrapperClassName, ...props }: SelectProps) => {
  return (
    <FieldWrapper
      label={label}
      iconLeft={iconLeft}
      iconRight={iconRight}
      message={message}
      messageClassName={messageClassName}
      className={wrapperClassName}
    >
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
    </FieldWrapper>
  )
}