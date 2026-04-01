import { FieldWrapper, FieldWrapperProps } from "@/components/ions/form-field-wrapper";
import { Input as UiInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<FieldWrapperProps, 'children'>, React.InputHTMLAttributes<HTMLInputElement> {
}

export const Input = ({ iconLeft, iconRight, className, label, message, messageClassName, ...props }: InputProps) => {
  return (
    <FieldWrapper
      label={label}
      iconLeft={iconLeft}
      iconRight={iconRight}
      message={message}
      messageClassName={messageClassName}
    >
      <UiInput {...props} className={cn('hover:bg-neutral-100', iconLeft ? "pl-10" : "", iconRight ? "pr-10" : "", className)} />
    </FieldWrapper>
  )
}