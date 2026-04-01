import { Input, InputProps } from "@/components/atoms/input";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

interface InputFieldProps extends InputProps {
  name: string;
  parser?: (value: string) => string;
}

export const TextField = ({ name, label, className, parser, ...props }: InputFieldProps) => {
  const { control } = useFormContext();

  const customOnChange = (onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parser) {
      e.target.value = parser(e.target.value);
    }

    return onChange(e);
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <Input
          label={label}
          onChange={customOnChange(onChange)}
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