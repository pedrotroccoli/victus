import { InputPassword, InputPasswordProps } from "@/components/atoms/input-password";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

interface PasswordFieldProps extends InputPasswordProps {
  name: string;
}

export const PasswordField = ({ name, label, className, ...props }: PasswordFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <InputPassword
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