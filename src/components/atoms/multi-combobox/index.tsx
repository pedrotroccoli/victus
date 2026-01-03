import { FieldWrapper, FieldWrapperProps } from "@/components/ions/form-field-wrapper";
import { MultiCombobox as UiMultiCombobox, MultiComboboxProps as UiMultiComboboxProps } from "@/components/ui/multi-combobox";

export interface MultiComboBoxProps extends UiMultiComboboxProps, Omit<FieldWrapperProps, 'children'> {
}

export const MultiComboBox = ({ label, iconLeft, iconRight, message, messageClassName, ...props }: MultiComboBoxProps) => {
  return (
    <FieldWrapper label={label} iconLeft={iconLeft} iconRight={iconRight} message={message} messageClassName={messageClassName}>
      <UiMultiCombobox {...props} />
    </FieldWrapper>
  );
};
