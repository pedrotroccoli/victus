import { TimeInput, TimeInputProps } from "@/components/atoms/time-input";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface TimeFieldProps extends TimeInputProps {
  name: string;
  parser?: (value: string) => string;
}

export const TimeField = ({ name, label, className, ...props }: TimeFieldProps) => {
  const { control } = useFormContext();
  const { t } = useTranslation('form');

  const [time, setTime] = useState<string>('');

  const message = useMemo(() => {
    if (time.length === 0 ) return ''

    if (time.length === 5) {
      const [minutes, seconds] = time.split(':');

      if (Number(minutes) === 0 && Number(seconds) === 0) {
        return '';
      }

      return t('time.explicit_time_without_hours', { minutes: parseInt(minutes), seconds: parseInt(seconds) });
    }

    const [hours, minutes, seconds] = time.split(':');

    return t('time.explicit_time', { hours: parseInt(hours), minutes: parseInt(minutes), seconds: parseInt(seconds) });
  }, [time]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <TimeInput
          {...props}
          label={label}
          onChangeInSeconds={onChange}
          onChange={(value) => {
            setTime(value);
          }}
          onBlur={onBlur}
          currentValue={value}
          className={cn(className, fieldState.error?.message && "border-red-500")}
          message={fieldState.error?.message ? fieldState.error.message : message}
          messageClassName={cn(fieldState.error?.message && "text-red-500")}
        />
      )}
    />
  )
}