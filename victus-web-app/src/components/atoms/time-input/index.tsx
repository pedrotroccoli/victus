import { FieldWrapper, FieldWrapperProps } from "@/components/ions/form-field-wrapper";
import { Time, TimeProps } from "@/components/ions/time-selector";
import { cn } from "@/lib/utils";

export interface TimeInputProps extends TimeProps, Omit<FieldWrapperProps, 'children'> {
}

export const TimeInput = ({ iconLeft, iconRight, className, label, message, messageClassName, ...props }: TimeInputProps) => {
  return (
    <FieldWrapper
      label={label}
      iconLeft={iconLeft}
      iconRight={iconRight}
      message={message}
      messageClassName={messageClassName}
    >
      <Time {...props} className={cn('hover:bg-neutral-100', iconLeft ? "pl-10" : "", iconRight ? "pr-10" : "", className)} hours min="00:00:00" max="23:59:59" />
    </FieldWrapper>
  )
}