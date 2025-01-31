import { Select, SelectProps } from "@/components/ions/select";
import { Controller, useFormContext } from "react-hook-form";

interface SelectFieldProps extends SelectProps {
  name: string;
}

export const SelectField = ({ name, ...props }: SelectFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Select onValueChange={onChange} onBlur={onBlur} value={value} {...props} />
      )}
    />
  )
}