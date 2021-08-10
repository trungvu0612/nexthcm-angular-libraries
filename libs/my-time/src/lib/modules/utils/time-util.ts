import { padStart } from '@taiga-ui/cdk';
import { intervalToDuration, secondsToMilliseconds } from 'date-fns';

export class TimeUtils {
  static getHourMinuteStringBySeconds(seconds: number | undefined | null): string {
      if (seconds === null || seconds === undefined) {
          return '00:00';
      }
      const duration = intervalToDuration({ start: 0, end: secondsToMilliseconds(seconds) });
      const hourString = padStart(duration.hours + '',2,'0');
      const minuteString = padStart(duration.minutes + '',2, '0');
      return `${hourString}:${minuteString}`;
  }
}
