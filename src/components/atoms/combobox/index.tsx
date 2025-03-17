import { FieldWrapper, FieldWrapperProps } from "@/components/ions/form-field-wrapper";
import { Combobox as UiCombobox, ComboboxProps as UiComboboxProps } from "@/components/ui/combobox";

export interface ComboBoxProps extends UiComboboxProps, Omit<FieldWrapperProps, 'children'> {
}

export const ComboBox = ({ label, iconLeft, iconRight, message, messageClassName, ...props }: ComboBoxProps) => {
  return (
    <FieldWrapper label={label} iconLeft={iconLeft} iconRight={iconRight} message={message} messageClassName={messageClassName}>
      <UiCombobox {...props} />
    </FieldWrapper>
  );
};
