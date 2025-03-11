import { FieldWrapper, FieldWrapperProps } from "@/components/ions/form-field-wrapper";
import { ToggleGroupItem, ToggleGroup as UiToggleGroup } from "@/components/ui/toggle-group";
import { ToggleGroupMultipleProps } from "@radix-ui/react-toggle-group";

export interface ToggleGroupProps extends Omit<ToggleGroupMultipleProps, 'type'>, Omit<FieldWrapperProps, 'children' | 'iconLeft' | 'iconRight'> {
  options: {
    label: string;
    value: string;
  }[];
  className?: string;
}

export const ToggleGroup = ({ options, label, message, messageClassName, ...props }: ToggleGroupProps) => {
  return (
    <FieldWrapper
      label={label}
      message={message}
      messageClassName={messageClassName}
    >
      <UiToggleGroup
        variant="outline"
        type="multiple"
        {...props}
      >
        {options.map((day) => (
          <ToggleGroupItem className='w-4 h-8 p-0 border text-xs data-[state=on]:bg-black data-[state=on]:text-white' key={day.value} value={day.value}>{day.label}</ToggleGroupItem>
        ))}
      </UiToggleGroup>
    </FieldWrapper>
  )
}