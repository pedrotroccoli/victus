import { Select, SelectProps } from "@/components/atoms/select";
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
      render={({ field: { onChange, value } }) => (
        <Select onValueChange={onChange} value={value} {...props} />
      )}
    />
  )
}