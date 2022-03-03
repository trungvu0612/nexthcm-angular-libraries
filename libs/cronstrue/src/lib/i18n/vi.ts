import { Locale } from './locale';

export class vi implements Locale {
  atX0SecondsPastTheMinuteGt20(): string | null {
    return null;
  }
  atX0MinutesPastTheHourGt20(): string | null {
    return null;
  }
  commaMonthX0ThroughMonthX1(): string | null {
    return null;
  }
  commaYearX0ThroughYearX1(): string | null {
    return null;
  }

  use24HourTimeFormatByDefault(): boolean {
    return false;
  }

  anErrorOccurredWhenGeneratingTheExpressionD(): string {
    return 'Đã xảy ra lỗi khi tạo mô tả cho biểu thức. Kiểm tra cú pháp của biểu thức cron';
  }
  everyMinute(): string {
    return 'mỗi phút';
  }
  everyHour(): string {
    return 'mỗi giờ';
  }
  atSpace(): string {
    return 'Tại ';
  }
  everyMinuteBetweenX0AndX1(): string {
    return 'Mỗi phút trong khoảng từ %s đến %s';
  }
  at(): string {
    return 'Tại';
  }
  spaceAnd(): string {
    return ' và';
  }
  everySecond(): string {
    return 'mỗi giây';
  }
  everyX0Seconds(): string {
    return 'mỗi %s giây';
  }
  secondsX0ThroughX1PastTheMinute(): string {
    return 'mỗi giây trong khoảng từ %s đến %s';
  }
  atX0SecondsPastTheMinute(): string {
    return 'tại giây thứ %s';
  }
  everyX0Minutes(): string {
    return 'mỗi %s phút';
  }
  minutesX0ThroughX1PastTheHour(): string {
    return 'mỗi phút trong khoảng từ %s đến %s';
  }
  atX0MinutesPastTheHour(): string {
    return 'tại phút thứ %s';
  }
  everyX0Hours(): string {
    return 'mỗi %s giờ';
  }
  betweenX0AndX1(): string {
    return 'giữa %s và %s';
  }
  atX0(): string {
    return 'tại %s';
  }
  commaEveryDay(): string {
    return ', mỗi ngày';
  }
  commaEveryX0DaysOfTheWeek(): string {
    return ', mỗi %s ngày thường trong tuần';
  }
  commaX0ThroughX1(): string {
    return ', %s đến %s';
  }
  first(): string {
    return 'có thứ tự đầu tiên';
  }
  second(): string {
    return 'có thứ tự thứ 2';
  }
  third(): string {
    return 'có thứ tự thứ 3';
  }
  fourth(): string {
    return 'có thứ tự thứ 4';
  }
  fifth(): string {
    return 'có thứ tự thứ 5';
  }
  commaOnThe(): string {
    return ', vào ';
  }
  spaceX0OfTheMonth(): string {
    return ' ngày %s ';
  }
  lastDay(): string {
    return 'ngày cuối';
  }
  commaOnTheLastX0OfTheMonth(): string {
    return ', vào %s cuối cùng của tháng';
  }
  commaOnlyOnX0(): string {
    return ', chỉ vào %s';
  }
  commaAndOnX0(): string {
    return ', và vào %s';
  }
  commaEveryX0Months(): string {
    return ', mỗi %s tháng';
  }
  commaOnlyInX0(): string {
    return ', chỉ trong %s';
  }
  commaOnTheLastDayOfTheMonth(): string {
    return ', vào ngày cuối tháng';
  }
  commaOnTheLastWeekdayOfTheMonth(): string {
    return ', vào ngày thường trong tuần cuối cùng của tháng';
  }
  commaDaysBeforeTheLastDayOfTheMonth(): string {
    return ', %s ngày trước ngày cuối cùng của tháng';
  }
  firstWeekday(): string {
    return 'ngày thường trong tuần thứ nhất';
  }
  weekdayNearestDayX0(): string {
    return 'ngày thường trong tuần gần với ngày %s nhất';
  }
  commaOnTheX0OfTheMonth(): string {
    return ', vào ngày %s trong tháng';
  }
  commaEveryX0Days(): string {
    return ', mỗi %s ngày';
  }
  commaBetweenDayX0AndX1OfTheMonth(): string {
    return ', giữa ngày %s và %s trong tháng';
  }
  commaOnDayX0OfTheMonth(): string {
    return ', vào ngày %s trong tháng';
  }
  commaEveryHour(): string {
    return ', mỗi giờ';
  }
  commaEveryX0Years(): string {
    return ', mỗi %s năm';
  }
  commaStartingX0(): string {
    return ', bắt đầu %s';
  }
  daysOfTheWeek(): string[] {
    return ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  }
  monthsOfTheYear(): string[] {
    return [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ];
  }
}
