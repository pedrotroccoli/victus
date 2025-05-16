import {
  type InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Input } from '@/components/ui/input';

const removeSpaces = (value: string = '') => value.replace(/\s/g, '');

export const HHMMSSToSeconds = (value?: number | string): number => {
  if (!value || !removeSpaces(`${value}`).length) return 0;

  const times = [1, 60, 3600];
  const values = removeSpaces(`${value}`).split(':');

  return values.reduce((acc, time, index) => acc + Number(time) * times[values.length - index - 1], 0);
};

import { TimeMask } from './mask';

export interface TimeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  currentValue?: string;
  defaultValue?: string;
  hours?: boolean;
  initialValue?: string;
  max?: string;
  min?: string;
  onChange?: (value: string) => void;
  onChangeInSeconds?: (value: number) => void;
}

const adjustCursorPosition = (currentValue = '', newValue = '', cursorPosition = 0) => {
  const nonDigitsBeforeCursor = (str = '', index = 0) => str.substring(0, index).replace(/\d/g, '').length;

  const nonDigitsBeforeCursorOld = nonDigitsBeforeCursor(currentValue, cursorPosition);
  const nonDigitsBeforeCursorNew = nonDigitsBeforeCursor(newValue, cursorPosition + nonDigitsBeforeCursorOld);

  return cursorPosition + (nonDigitsBeforeCursorNew - nonDigitsBeforeCursorOld);
};

export const Time = ({
  currentValue,
  initialValue,
  defaultValue,
  min,
  max,
  hours,
  hidden,
  onChange,
  onChangeInSeconds,
  onFocus,
  onBlur,
  ...props
}: TimeProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [changed, setChanged] = useState(false);
  const [value, setValue] = useState(() => initialValue ?? currentValue ?? defaultValue ?? '00:00');
  const [isBackspace, setIsBackspace] = useState(false);

  const handleChange = useCallback((currentValue: string) => {
    const position = inputRef.current?.selectionStart ?? 0;
    const minTime = min ?? '00:00';
    const maxTime = hours ? max ?? '23:59:59' : max ?? '59:59';
    const isBackspace = value.length > currentValue.length;

    setIsBackspace(isBackspace);

    const formattedValue = TimeMask.format({
      value: currentValue,
      minTime,
      maxTime,
      backspace: isBackspace,
      position,
    });

    if (!changed && formattedValue !== initialValue) setChanged(true);

    setValue(formattedValue);

    if (onChange) onChange(formattedValue);
    if (onChangeInSeconds) onChangeInSeconds(HHMMSSToSeconds(formattedValue));

    setTimeout(() => {
      if (inputRef.current) {
        const adjustedCursorPosition = adjustCursorPosition(currentValue, formattedValue, position);

        inputRef.current.setSelectionRange(adjustedCursorPosition, adjustedCursorPosition);
      }
    }, 0);
  }, [changed, initialValue, onChange, onChangeInSeconds, max, min, value.length, hours]);

  useEffect(() => {
    if (!changed && initialValue) handleChange(initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  useEffect(() => {
    if (currentValue && !isBackspace && HHMMSSToSeconds(currentValue) !== HHMMSSToSeconds(value)) {
      handleChange(currentValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue]);

  if (hidden) return null;

  return (
    <Input
      {...props}
      onBlur={(event) => {
        if (isBackspace) handleChange(value);
        if (onBlur) onBlur(event);
      }}
      onChange={(event) => handleChange(event.target.value)}
      onFocus={(event) => {
        if (inputRef.current) inputRef.current.select();
        if (onFocus) onFocus(event);
      }}
      ref={inputRef}
      value={value}
    />
  );
};
