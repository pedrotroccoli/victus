const removeSpaces = (value: string = '') => value.replace(/\s/g, '');

/**
 * Converts seconds to the HH:MM:SS format.
 */
export const secondsToHHMMSS = (seconds?: number): string => {
  if (!seconds) return '00:00';

  const start = seconds < 3600 ? 14 : 11;

  return new Date(seconds * 1000).toISOString().slice(start, -5);
};

/**
 * Converts a duration in HH:MM:SS format to seconds.
 */
export const HHMMSSToSeconds = (value?: number | string): number => {
  if (!value || !removeSpaces(`${value}`).length) return 0;

  const times = [1, 60, 3600];
  const values = removeSpaces(`${value}`).split(':');

  return values.reduce((acc, time, index) => acc + Number(time) * times[values.length - index - 1], 0);
};



export type ITimeMaskConfigs = {
  backspace: boolean;
  maxTime: string;
  minTime: string;
  position: number;
  value: string;
};

const LAST_POSITION_TO_HHMMSS = 5;
const CHARS_PER_DIGIT = 2;
const MMSS_LENGTH = 4;
const HHMMSS_LENGTH = 6;

const addSeparatorEveryTwoChars = (value: string): string => value.split('').reduce((acc, char, index) => {
  if (index % CHARS_PER_DIGIT === 0 && index > 0) return `${acc}:${char}`;

  return acc + char;
}, '');

const formatToTimeString = (value: number | string): string => {
  const numbers = String(value).replace(/\D/g, '');

  const quantityOfChars = numbers.length <= MMSS_LENGTH ? MMSS_LENGTH : HHMMSS_LENGTH;
  const valueByPattern = numbers.substring(0, quantityOfChars);
  const valueWithPadding = valueByPattern.padEnd(quantityOfChars, '0');

  return addSeparatorEveryTwoChars(valueWithPadding);
};

const formatToSeconds = (value: string): number => HHMMSSToSeconds(formatToTimeString(value));

export const increase = (value: string, increasedValue: number): string => {
  const seconds = HHMMSSToSeconds(value);

  return secondsToHHMMSS(seconds + increasedValue);
};

export class TimeMask {
  static createInstance = (configs: Partial<ITimeMaskConfigs>) => new TimeMask({
    ...configs,
    value: configs.value || '00:00',
    backspace: configs.backspace || false,
    position: configs.position || 0,
    maxTime: configs.maxTime || '23:59:59',
    minTime: configs.minTime || '00:00:00',
  });

  static format = (configs: Partial<ITimeMaskConfigs>) => TimeMask.createInstance(configs).format();

  public formatValueAfterTyping = (value: string): string => {
    const values = value.split(':');
    const valuesWithMoreThan = values.filter((val) => val.length > CHARS_PER_DIGIT);

    if (!valuesWithMoreThan.length || this.configs.position > LAST_POSITION_TO_HHMMSS) return value;

    const onlyNumbers = value.replace(/\D/g, '');
    const newValue = onlyNumbers.substring(0, onlyNumbers.length - valuesWithMoreThan.length);

    return formatToTimeString(newValue);
  };

  constructor(private readonly configs: ITimeMaskConfigs) {
    this.configs = {
      ...configs, value: this.formatValueAfterTyping(configs.value),
    };
  }

  public format(): string {
    if (this.configs.backspace) return this.configs.value.substring(0, this.configs.position);

    const value = formatToSeconds(this.configs.value);
    const maxTime = formatToSeconds(this.configs.maxTime);
    const minTime = formatToSeconds(this.configs.minTime);

    const minTimeValidated = minTime > maxTime ? maxTime : minTime;

    const result = Math.max(minTimeValidated, Math.min(value, maxTime));

    return secondsToHHMMSS(result);
  }
}
