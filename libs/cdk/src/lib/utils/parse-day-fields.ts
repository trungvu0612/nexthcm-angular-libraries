import { TuiDay } from '@taiga-ui/cdk';

export function parseTuiDayFields<T extends Record<string, any>, K extends keyof T>(obj: T, props: K[] = []): T {
  obj = { ...obj };

  props.forEach((prop) => {
    if (obj[prop]) {
      obj[prop] = TuiDay.fromUtcNativeDate(new Date(obj[prop] as string)) as any;
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
