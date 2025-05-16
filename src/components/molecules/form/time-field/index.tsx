import { TimeInput, TimeInputProps } from "@/components/atoms/time-input";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

interface TimeFieldProps extends TimeInputProps {
  name: string;
  parser?: (value: string) => string;
}

export const TimeField = ({ name, label, className, ...props }: TimeFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <TimeInput
          {...props}
          label={label}
          onChangeInSeconds={onChange}
          onBlur={onBlur}
          currentValue={value}
          className={cn(className, fieldState.error?.message && "border-red-500")}
          message={fieldState.error?.message}
          messageClassName="text-red-500"
        />
      )}
    />
  )
}