import { ToggleGroup, ToggleGroupProps } from "@/components/atoms/toggle-group";
import { Controller, useFormContext } from "react-hook-form";

interface ToggleGroupFieldProps extends ToggleGroupProps {
  name: string;
  options: {
    label: string;
    value: string;
  }[];
}

export const ToggleGroupField = ({ name, options, ...props }: ToggleGroupFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <ToggleGroup
          options={options}
          onValueChange={onChange}
          onBlur={onBlur}
          value={value}
          message={fieldState.error?.message}
          messageClassName={"text-red-500"}
          {...props}
        />
      )}
    />
  )
}