import { addHours, format } from 'date-fns';

// Australian Eastern Standard Time, UTC+10:00
const timezoneOffset = 10;

export function fitDate(date: Date, formattingOptions: string = 'DD.MM.YYYY [at] HH:mm'): string {
  const correctedDate = fitTimezone(date);

  return format(correctedDate, formattingOptions);
}

export function fitTimezone(date: Date): Date {
  return addHours(date, timezoneOffset);
}
