import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form"

interface CheckboxFieldProps extends ComponentProps<typeof Checkbox> {
  name: string;
  label?: string;
  placeholder?: string;
}

export const CheckboxField = ({ name, label, className, ...props }: CheckboxFieldProps) => {
  const {  control } = useFormContext();

  const checkboxClassName = ``;

  return (
    <div>
      {label && (
        <label className="text-sm font-medium mb-2 block" htmlFor={name}>{label}</label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            onCheckedChange={onChange}
            checked={value}
            className={cn(checkboxClassName, className)}
            {...props}
          />
       )}
      />
    </div>
  )
}