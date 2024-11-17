import { Input, InputProps } from "@/components/ions/input";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

interface InputFieldProps extends InputProps {
  name: string;
}

export const TextField = ({ name, label, className, ...props }: InputFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <Input
          label={label}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          className={cn(className, fieldState.error?.message && "border-red-500")}
          message={fieldState.error?.message}
          messageClassName="text-red-500"
          {...props}
        />
      )}
    />
  )
}