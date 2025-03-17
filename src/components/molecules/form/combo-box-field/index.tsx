import { ComboBox, ComboBoxProps } from "@/components/atoms/combobox";
import { Controller, useFormContext } from "react-hook-form";

interface ComboBoxFieldProps extends Omit<ComboBoxProps, 'onChange' | 'value'> {
  name: string;
}

export const ComboBoxField = ({ name, ...props }: ComboBoxFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <ComboBox {...props} onChange={onChange} value={value} />
      )}
    />
  )
}