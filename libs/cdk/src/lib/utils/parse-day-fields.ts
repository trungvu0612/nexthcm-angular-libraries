import { TuiDay } from '@taiga-ui/cdk';
import { isValid } from 'date-fns';

export function parseTuiDayFields<T extends Record<string, any>, K extends keyof T>(obj: T, props: K[] = []): T {
  obj = { ...obj };

  props.forEach((prop) => {
    if (typeof obj[prop] === 'string') {
      const date = new Date(obj[prop]);

      obj[prop] = (isValid(date) ? TuiDay.fromUtcNativeDate(date) : null) as any;
    }
  });

  return obj;
}

export function parseDateFields<T extends Record<string, any>, K extends keyof T>(obj: T, props: K[] = []): T {
  obj = { ...obj };

  props.forEach((prop) => {
    if (obj[prop]) {
      obj[prop] = (obj[prop] as TuiDay).toUtcNativeDate() as any;
    }
  });

  return obj;
}

export function secondsToTime(secs: any) {
  const hours = Math.floor(secs / (60 * 60));
  const divisor_for_minutes = secs % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);
  const divisor_for_seconds = divisor_for_minutes % 60;
  const seconds = Math.ceil(divisor_for_seconds);
  const obj = {
    h: hours === 0 ? '0' : hours < 10 ? `${hours}` : hours,
    m: minutes === 0 ? '00' : minutes < 10 ? `${minutes}` : minutes,
    s: seconds,
  };
  return obj;
}
