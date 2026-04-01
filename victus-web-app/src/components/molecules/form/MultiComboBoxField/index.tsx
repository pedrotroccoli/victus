import { MultiComboBox, MultiComboBoxProps } from "@/components/atoms/multi-combobox";
import { Controller, useFormContext } from "react-hook-form";

interface MultiComboBoxFieldProps extends Omit<MultiComboBoxProps, 'onChange' | 'value'> {
  name: string;
}

export const MultiComboBoxField = ({ name, ...props }: MultiComboBoxFieldProps) => {
  const { control, formState: { errors } } = useFormContext();

  const error = errors[name];

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <MultiComboBox
          {...props}
          onChange={onChange}
          value={value || []}
          message={error?.message as string}
        />
      )}
    />
  )
}
