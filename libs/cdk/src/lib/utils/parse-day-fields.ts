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
