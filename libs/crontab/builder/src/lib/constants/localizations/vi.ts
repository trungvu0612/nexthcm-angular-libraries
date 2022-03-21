import { CronLocalization } from '../../models';

export const VI_LOCALIZATION: CronLocalization = {
  common: {
    month: {
      january: 'Tháng 1',
      february: 'Tháng 2',
      march: 'Tháng 3',
      april: 'Tháng 4',
      may: 'Tháng 5',
      june: 'Tháng 6',
      july: 'Tháng 7',
      august: 'Tháng 8',
      september: 'Tháng 9',
      october: 'Tháng 10',
      november: 'Tháng 11',
      december: 'Tháng 12',
    },
    dayOfWeek: {
      sunday: 'Chủ nhật',
      monday: 'Thứ hai',
      tuesday: 'Thứ ba',
      wednesday: 'Thứ tư',
      thursday: 'Thứ năm',
      friday: 'Thứ sáu',
      saturday: 'Thứ bảy',
    },
    dayOfMonth: {
      '1st': '1',
      '2nd': '2',
      '3rd': '3',
      '4th': '4',
      '5th': '5',
      '6th': '6',
      '7th': '7',
      '8th': '8',
      '9th': '9',
      '10th': '10',
      '11th': '11',
      '12th': '12',
      '13th': '13',
      '14th': '14',
      '15th': '15',
      '16th': '16',
      '17th': '17',
      '18th': '18',
      '19th': '19',
      '20th': '20',
      '21st': '21',
      '22nd': '22',
      '23rd': '23',
      '24th': '24',
      '25th': '25',
      '26th': '26',
      '27th': '27',
      '28th': '28',
      '29th': '29',
      '30th': '30',
      '31st': '31',
    },
  },
  tabs: {
    seconds: 'Giây',
    minutes: 'Phút',
    hours: 'Giờ',
    day: 'Ngày',
    month: 'Tháng',
    year: 'Năm',
  },
  quartz: {
    day: {
      every: {
        label: 'Mỗi ngày',
      },
      dayOfWeekIncrement: {
        label1: 'Mỗi',
        label2: 'ngày bắt đầu từ',
      },
      dayOfMonthIncrement: {
        label1: 'Mỗi',
        label2: 'ngày bắt đầu từ ngày',
        label3: 'trong tháng',
      },
      dayOfWeekAnd: {
        label: 'Ngày cụ thể trong tuần (chọn một hoặc nhiều)',
      },
      dayOfWeekRange: {
        label1: 'Mỗi ngày trong khoảng từ',
        label2: 'đến',
      },
      dayOfMonthAnd: {
        label: 'Ngày cụ thể trong tháng (chọn một hoặc nhiều)',
      },
      dayOfMonthLastDay: {
        label: 'Vào ngày cuối tháng',
      },
      dayOfMonthLastDayWeek: {
        label: 'Vào ngày làm việc trong tuần cuối cùng của tháng',
      },
      dayOfWeekLastNTHDayWeek: {
        label1: 'Vào',
        label2: 'cuối cùng của tháng',
      },
      dayOfMonthDaysBeforeEndMonth: {
        label: 'ngày trước ngày cuối cùng của tháng',
      },
      dayOfMonthNearestWeekDayOfMonth: {
        label1: 'Ngày làm việc trong tuần gần nhất (Thứ hai đến Thứ sáu) của ngày',
        label2: 'trong tháng',
      },
      dayOfWeekNTHWeekDayOfMonth: {
        label1: 'Vào ngày có thứ tự là',
        label2: 'của',
        label3: 'trong tháng',
      },
    },
    month: {
      every: {
        label: 'Mỗi tháng',
      },
      increment: {
        label1: 'Mỗi',
        label2: 'tháng bắt đầu từ',
      },
      and: {
        label: 'Tháng cụ thể (chọn một hoặc nhiều)',
      },
      range: {
        label1: 'Mỗi tháng trong khoảng từ',
        label2: 'đến',
      },
    },
    second: {
      every: {
        label: 'Mỗi giây',
      },
      increment: {
        label1: 'Mỗi',
        label2: 'giây bắt đầu từ giây',
      },
      and: {
        label: 'Giây cụ thể (chọn một hoặc nhiều)',
      },
      range: {
        label1: 'Mỗi giây trong khoảng từ giây',
        label2: 'đến giây',
      },
    },
    minute: {
      every: {
        label: 'Mỗi phút',
      },
      increment: {
        label1: 'Mỗi',
        label2: 'phút bắt đầu từ phút',
      },
      and: {
        label: 'Phút cụ thể (chọn một hoặc nhiều)',
      },
      range: {
        label1: 'Mỗi phút trong khoảng từ phút',
        label2: 'đến phút',
      },
    },
    hour: {
      every: {
        label: 'Mỗi giờ',
      },
      increment: {
        label1: 'Mỗi',
        label2: 'giờ bắt đầu từ giờ',
      },
      and: {
        label: 'Giờ cụ thể (chọn một hoặc nhiều)',
      },
      range: {
        label1: 'Mỗi giờ trong khoảng từ giờ',
        label2: 'đến giờ',
      },
    },
    year: {
      every: {
        label: 'Mỗi năm',
      },
      increment: {
        label1: 'Mỗi',
        label2: 'năm bắt đầu từ',
      },
      and: {
        label: 'Năm cụ thể (chọn một hoặc nhiều)',
      },
      range: {
        label1: 'Mỗi năm trong khoảng từ',
        label2: 'đến',
      },
    },
  },
  unix: {
    day: {
      every: {
        label: 'Every day',
      },
      dayOfWeekIncrement: {
        label1: 'Every',
        label2: 'day(s) of week',
      },
      dayOfMonthIncrement: {
        label1: 'Every',
        label2: 'day(s) of month',
      },
      dayOfWeekAnd: {
        label: 'Specific day of week (chọn một hoặc nhiều)',
      },
      dayOfMonthAnd: {
        label: 'Specific day of month (chọn một hoặc nhiều)',
      },
    },
    month: {
      every: {
        label: 'Every month',
      },
      increment: {
        label1: 'Every',
        label2: 'month(s)',
      },
      and: {
        label: 'Specific month (chọn một hoặc nhiều)',
      },
      range: {
        label1: 'Every month between month',
        label2: 'and month',
      },
    },
    minute: {
      every: {
        label: 'Every minute',
      },
      increment: {
        label1: 'Every',
        label2: 'minute(s)',
      },
      and: {
        label: 'Specific minute (chọn một hoặc nhiều)',
      },
      range: {
        label1: 'Every minute between minute',
        label2: 'and minute',
      },
    },
    hour: {
      every: {
        label: 'Every hour',
      },
      increment: {
        label1: 'Every',
        label2: 'hour(s)',
      },
      and: {
        label: 'Specific hour (chọn một hoặc nhiều)',
      },
      range: {
        label1: 'Every hour between hour',
        label2: 'and hour',
      },
    },
  },
};
