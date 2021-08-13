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

export function secondsToTime(secs: any) {
  const hours = Math.floor(secs / (60 * 60));
  const divisor_for_minutes = secs % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);
  const divisor_for_seconds = divisor_for_minutes % 60;
  const seconds = Math.ceil(divisor_for_seconds);
  const obj = {
    "h": hours === 0 ? '0' : (hours < 10 ? `${hours}` : hours),
    "m": minutes === 0 ? '00' : (minutes < 10 ? `${minutes}` : minutes),
    "s": seconds
  };
  return obj;
}
