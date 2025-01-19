import { DatePicker, DatePickerProps } from "@/components/datepicker";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

type DatePickerFieldProps = DatePickerProps & {
  name: string;
  label: string;
  placeholder?: string;
}

export const DatePickerField = ({ name, label, className, ...props }: DatePickerFieldProps) => {
  const { control } = useFormContext();

  const datePickerClassName = `rounded placeholder:text-neutral-400`;

  return (
    <div>
      <label className="text-sm font-medium mb-2 block" htmlFor={name}>{label}</label>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <DatePicker
            onSelect={onChange}
            onDayBlur={onBlur}
            selected={value}
            className={cn(datePickerClassName, className)}
            {...props}
          />
        )}
      />
    </div>
  )
}