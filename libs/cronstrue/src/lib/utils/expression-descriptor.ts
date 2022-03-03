import { Locale } from '../i18n/locale';
import { LocaleLoader } from '../i18n/locale-loader';
import { CronParser } from './cron-parser';
import { Options } from './options';
import { StringUtilities } from './string-utilities';

export class ExpressionDescriptor {
  static locales: { [name: string]: Locale } = {};
  static specialCharacters: string[];

  expression: string;
  expressionParts: string[];
  options: Options;
  i18n: Locale;

  constructor(expression: string, options: Options) {
    this.expression = expression;
    this.options = options;
    this.expressionParts = new Array(5);

    if (ExpressionDescriptor.locales[options.locale as string]) {
      this.i18n = ExpressionDescriptor.locales[options.locale as string];
    } else {
      // fall back to English
      console.warn(`Locale '${options.locale}' could not be found; falling back to 'en'.`);
      this.i18n = ExpressionDescriptor.locales['en'];
    }

    if (options.use24HourTimeFormat === undefined) {
      // if use24HourTimeFormat not specified, set based on locale default
      options.use24HourTimeFormat = this.i18n.use24HourTimeFormatByDefault();
    }
  }

  /**
   * Converts a cron expression into a description a human can read
   * @static
   * @param {string} expression - The cron expression
   * @param {Options} [{
   *         throwExceptionOnParseError = true,
   *         casingType = CasingTypeEnum.Sentence,
   *         verbose = false,
   *         dayOfWeekStartIndexZero = true,
   *         monthStartIndexZero = false,
   *         use24HourTimeFormat = false,
   *         locale = 'en'
   *     }={}]
   * @returns {string}
   */
  static toString(
    expression: string,
    {
      throwExceptionOnParseError = true,
      verbose = false,
      dayOfWeekStartIndexZero = true,
      monthStartIndexZero = false,
      use24HourTimeFormat,
      locale = 'vi',
    }: Options = {}
  ): string {
    // We take advantage of Destructuring Object Parameters (and defaults) in TS/ES6, and now we will reassemble back to
    // an Options type, so we can pass around options with ease.

    const options = <Options>{
      throwExceptionOnParseError: throwExceptionOnParseError,
      verbose: verbose,
      dayOfWeekStartIndexZero: dayOfWeekStartIndexZero,
      monthStartIndexZero: monthStartIndexZero,
      use24HourTimeFormat: use24HourTimeFormat,
      locale: locale,
    };

    const descriptor = new ExpressionDescriptor(expression, options);
    return descriptor.getFullDescription();
  }

  static initialize(localesLoader: LocaleLoader) {
    ExpressionDescriptor.specialCharacters = ['/', '-', ',', '*'];

    // Load locales
    localesLoader.load(ExpressionDescriptor.locales);
  }

  protected getFullDescription(): string {
    let description = '';

    try {
      const parser = new CronParser(
        this.expression,
        this.options.dayOfWeekStartIndexZero,
        this.options.monthStartIndexZero
      );
      this.expressionParts = parser.parse();
      const timeSegment = this.getTimeOfDayDescription();
      const dayOfMonthDesc = this.getDayOfMonthDescription();
      const monthDesc = this.getMonthDescription();
      const dayOfWeekDesc = this.getDayOfWeekDescription();
      const yearDesc = this.getYearDescription();

      description += timeSegment + dayOfMonthDesc + dayOfWeekDesc + monthDesc + yearDesc;
      description = this.transformVerbosity(description, !!this.options.verbose);

      // uppercase first character
      description = description.charAt(0).toLocaleUpperCase() + description.substr(1);
    } catch (ex) {
      if (!this.options.throwExceptionOnParseError) {
        description = this.i18n.anErrorOccurredWhenGeneratingTheExpressionD();
      } else {
        throw `${ex}`;
      }
    }
    return description;
  }

  protected getTimeOfDayDescription(): string {
    const secondsExpression: string = this.expressionParts[0];
    const minuteExpression: string = this.expressionParts[1];
    const hourExpression: string = this.expressionParts[2];

    let description = '';

    // handle special cases first
    if (
      !StringUtilities.containsAny(minuteExpression, ExpressionDescriptor.specialCharacters) &&
      !StringUtilities.containsAny(hourExpression, ExpressionDescriptor.specialCharacters) &&
      !StringUtilities.containsAny(secondsExpression, ExpressionDescriptor.specialCharacters)
    ) {
      // specific time of day (i.e. 10 14)
      description += this.i18n.atSpace() + this.formatTime(hourExpression, minuteExpression, secondsExpression);
    } else if (
      !secondsExpression &&
      minuteExpression.indexOf('-') > -1 &&
      !(minuteExpression.indexOf(',') > -1) &&
      !(minuteExpression.indexOf('/') > -1) &&
      !StringUtilities.containsAny(hourExpression, ExpressionDescriptor.specialCharacters)
    ) {
      // minute range in single hour (i.e. 0-10 11)
      const minuteParts: string[] = minuteExpression.split('-');
      description += StringUtilities.format(
        this.i18n.everyMinuteBetweenX0AndX1(),
        this.formatTime(hourExpression, minuteParts[0], ''),
        this.formatTime(hourExpression, minuteParts[1], '')
      );
    } else if (
      !secondsExpression &&
      hourExpression.indexOf(',') > -1 &&
      hourExpression.indexOf('-') == -1 &&
      hourExpression.indexOf('/') == -1 &&
      !StringUtilities.containsAny(minuteExpression, ExpressionDescriptor.specialCharacters)
    ) {
      // hours list with single minute (i.e. 30 6,14,16)
      const hourParts: string[] = hourExpression.split(',');
      description += this.i18n.at();

      for (let i = 0; i < hourParts.length; i++) {
        description += ' ';
        description += this.formatTime(hourParts[i], minuteExpression, '');

        if (i < hourParts.length - 2) {
          description += ',';
        }

        if (i == hourParts.length - 2) {
          description += this.i18n.spaceAnd();
        }
      }
    } else {
      // default time description
      const secondsDescription = this.getSecondsDescription();
      const minutesDescription = this.getMinutesDescription();
      const hoursDescription = this.getHoursDescription();

      description += secondsDescription;

      if (description.length > 0 && minutesDescription.length > 0) {
        description += ', ';
      }

      description += minutesDescription;

      if (minutesDescription === hoursDescription) {
        return description;
      }

      if (description.length > 0 && hoursDescription.length > 0) {
        description += ', ';
      }

      description += hoursDescription;
    }

    return description;
  }

  protected getSecondsDescription(): string {
    return this.getSegmentDescription(
      this.expressionParts[0],
      this.i18n.everySecond(),
      (s) => {
        return s;
      },
      (s) => {
        return StringUtilities.format(this.i18n.everyX0Seconds(), s);
      },
      () => {
        return this.i18n.secondsX0ThroughX1PastTheMinute();
      },
      (s) => {
        return s == '0'
          ? ''
          : parseInt(s) < 20
          ? this.i18n.atX0SecondsPastTheMinute()
          : this.i18n.atX0SecondsPastTheMinuteGt20() || this.i18n.atX0SecondsPastTheMinute();
      }
    );
  }

  protected getMinutesDescription(): string {
    const secondsExpression = this.expressionParts[0];
    const hourExpression = this.expressionParts[2];
    return this.getSegmentDescription(
      this.expressionParts[1],
      this.i18n.everyMinute(),
      (s) => {
        return s;
      },
      (s) => {
        return StringUtilities.format(this.i18n.everyX0Minutes(), s);
      },
      () => {
        return this.i18n.minutesX0ThroughX1PastTheHour();
      },
      (s) => {
        try {
          return s == '0' && hourExpression.indexOf('/') == -1 && secondsExpression == ''
            ? this.i18n.everyHour()
            : parseInt(s) < 20
            ? this.i18n.atX0MinutesPastTheHour()
            : this.i18n.atX0MinutesPastTheHourGt20() || this.i18n.atX0MinutesPastTheHour();
        } catch (e) {
          return this.i18n.atX0MinutesPastTheHour();
        }
      }
    );
  }

  protected getHoursDescription(): string {
    const expression = this.expressionParts[2];
    return this.getSegmentDescription(
      expression,
      this.i18n.everyHour(),
      (s) => {
        return this.formatTime(s, '0', '');
      },
      (s) => {
        return StringUtilities.format(this.i18n.everyX0Hours(), s);
      },
      () => {
        return this.i18n.betweenX0AndX1();
      },
      () => {
        return this.i18n.atX0();
      }
    );
  }

  protected getDayOfWeekDescription(): string {
    const daysOfWeekNames = this.i18n.daysOfTheWeek();

    let description: string;
    if (this.expressionParts[5] == '*') {
      // DOW is specified as * so we will not generate a description and defer to DOM part.
      // Otherwise, we could get a contradiction like "on day 1 of the month, every day"
      // or a dupe description like "every day, every day".
      description = '';
    } else {
      description = this.getSegmentDescription(
        this.expressionParts[5],
        this.i18n.commaEveryDay(),
        (s) => {
          let exp: string = s;
          if (s.indexOf('#') > -1) {
            exp = s.substr(0, s.indexOf('#'));
          } else if (s.indexOf('L') > -1) {
            exp = exp.replace('L', '');
          }

          return daysOfWeekNames[parseInt(exp)];
        },
        (s) => {
          if (parseInt(s) == 1) {
            // rather than "every 1 days" just return empty string
            return '';
          } else {
            return StringUtilities.format(this.i18n.commaEveryX0DaysOfTheWeek(), s);
          }
        },
        () => {
          return this.i18n.commaX0ThroughX1();
        },
        (s) => {
          let format: string | null;
          if (s.indexOf('#') > -1) {
            const dayOfWeekOfMonthNumber: string = s.substring(s.indexOf('#') + 1);
            let dayOfWeekOfMonthDescription: string | null = null;
            switch (dayOfWeekOfMonthNumber) {
              case '1':
                dayOfWeekOfMonthDescription = this.i18n.first();
                break;
              case '2':
                dayOfWeekOfMonthDescription = this.i18n.second();
                break;
              case '3':
                dayOfWeekOfMonthDescription = this.i18n.third();
                break;
              case '4':
                dayOfWeekOfMonthDescription = this.i18n.fourth();
                break;
              case '5':
                dayOfWeekOfMonthDescription = this.i18n.fifth();
                break;
            }

            format = this.i18n.commaOnThe() + this.i18n.spaceX0OfTheMonth() + dayOfWeekOfMonthDescription;
          } else if (s.indexOf('L') > -1) {
            format = this.i18n.commaOnTheLastX0OfTheMonth();
          } else {
            // If both DOM and DOW are specified, the cron will execute at either time.
            const domSpecified = this.expressionParts[3] != '*';
            format = domSpecified ? this.i18n.commaAndOnX0() : this.i18n.commaOnlyOnX0();
          }

          return format;
        }
      );
    }

    return description;
  }

  protected getMonthDescription(): string {
    const monthNames = this.i18n.monthsOfTheYear();

    return this.getSegmentDescription(
      this.expressionParts[4],
      '',
      (s) => {
        return monthNames[parseInt(s) - 1];
      },
      (s) => {
        //
        if (parseInt(s) == 1) {
          // rather than "every 1 months" just return empty string
          return '';
        } else {
          return StringUtilities.format(this.i18n.commaEveryX0Months(), s);
        }
      },
      () => {
        return this.i18n.commaMonthX0ThroughMonthX1() || this.i18n.commaX0ThroughX1();
      },
      () => {
        return this.i18n.commaOnlyInMonthX0 ? this.i18n.commaOnlyInMonthX0() : this.i18n.commaOnlyInX0();
      }
    );
  }

  protected getDayOfMonthDescription(): string {
    let description: string;
    const expression: string = this.expressionParts[3];
    const weekDayNumberMatches = expression.match(/(\d{1,2}W)|(W\d{1,2})/); // i.e. 3W or W2

    switch (expression) {
      case 'L':
        description = this.i18n.commaOnTheLastDayOfTheMonth();
        break;
      case 'WL':
      case 'LW':
        description = this.i18n.commaOnTheLastWeekdayOfTheMonth();
        break;
      default:
        if (weekDayNumberMatches) {
          const dayNumber: number = parseInt(weekDayNumberMatches[0].replace('W', ''));
          const dayString: string =
            dayNumber == 1
              ? this.i18n.firstWeekday()
              : StringUtilities.format(this.i18n.weekdayNearestDayX0(), dayNumber.toString());
          description = StringUtilities.format(this.i18n.commaOnTheX0OfTheMonth(), dayString);

          break;
        } else {
          // Handle "last day offset" (i.e. L-5:  "5 days before the last day of the month")
          const lastDayOffSetMatches = expression.match(/L-(\d{1,2})/);
          if (lastDayOffSetMatches) {
            const offSetDays = lastDayOffSetMatches[1];
            description = StringUtilities.format(this.i18n.commaDaysBeforeTheLastDayOfTheMonth(), offSetDays);
            break;
          } else if (expression == '*' && this.expressionParts[5] != '*') {
            // * dayOfMonth and dayOfWeek specified so use dayOfWeek verbiage instead
            return '';
          } else {
            description = this.getSegmentDescription(
              expression,
              this.i18n.commaEveryDay(),
              (s) => {
                return s == 'L'
                  ? this.i18n.lastDay()
                  : this.i18n.dayX0
                  ? StringUtilities.format(this.i18n.dayX0(), s)
                  : s;
              },
              (s) => {
                return s == '1' ? this.i18n.commaEveryDay() : this.i18n.commaEveryX0Days();
              },
              () => {
                return this.i18n.commaBetweenDayX0AndX1OfTheMonth();
              },
              () => {
                return this.i18n.commaOnDayX0OfTheMonth();
              }
            );
          }
          break;
        }
    }

    return description;
  }

  protected getYearDescription(): string {
    return this.getSegmentDescription(
      this.expressionParts[6],
      '',
      (s) => {
        return /^\d+$/.test(s) ? new Date(parseInt(s), 1).getFullYear().toString() : s;
      },
      (s) => {
        return StringUtilities.format(this.i18n.commaEveryX0Years(), s);
      },
      () => {
        return this.i18n.commaYearX0ThroughYearX1() || this.i18n.commaX0ThroughX1();
      },
      () => {
        return this.i18n.commaOnlyInYearX0 ? this.i18n.commaOnlyInYearX0() : this.i18n.commaOnlyInX0();
      }
    );
  }

  protected getSegmentDescription(
    expression: string,
    allDescription: string,
    getSingleItemDescription: (t: string) => string,
    getIncrementDescriptionFormat: (t: string) => string,
    getRangeDescriptionFormat: (t: string) => string,
    getDescriptionFormat: (t: string) => string
  ): string {
    let description: string | null = null;
    const doesExpressionContainIncrement = expression.indexOf('/') > -1;
    const doesExpressionContainRange = expression.indexOf('-') > -1;
    const doesExpressionContainMultipleValues = expression.indexOf(',') > -1;

    if (!expression) {
      // Empty
      description = '';
    } else if (expression === '*') {
      // * (All)
      description = allDescription;
    } else if (!doesExpressionContainIncrement && !doesExpressionContainRange && !doesExpressionContainMultipleValues) {
      // Simple
      description = StringUtilities.format(getDescriptionFormat(expression), getSingleItemDescription(expression));
    } else if (doesExpressionContainMultipleValues) {
      // Multiple Values

      const segments: string[] = expression.split(',');
      let descriptionContent = '';
      for (let i = 0; i < segments.length; i++) {
        if (i > 0 && segments.length > 2) {
          descriptionContent += ',';

          if (i < segments.length - 1) {
            descriptionContent += ' ';
          }
        }

        if (i > 0 && segments.length > 1 && (i == segments.length - 1 || segments.length == 2)) {
          descriptionContent += `${this.i18n.spaceAnd()} `;
        }

        if (segments[i].indexOf('/') > -1 || segments[i].indexOf('-') > -1) {
          // Multiple Values with Increment or Range

          const isSegmentRangeWithoutIncrement = segments[i].indexOf('-') > -1 && segments[i].indexOf('/') == -1;

          let currentDescriptionContent = this.getSegmentDescription(
            segments[i],
            allDescription,
            getSingleItemDescription,
            getIncrementDescriptionFormat,
            isSegmentRangeWithoutIncrement ? this.i18n.commaX0ThroughX1 : getRangeDescriptionFormat,
            getDescriptionFormat
          );

          if (isSegmentRangeWithoutIncrement) {
            currentDescriptionContent = currentDescriptionContent.replace(', ', '');
          }

          descriptionContent += currentDescriptionContent;
        } else if (!doesExpressionContainIncrement) {
          descriptionContent += getSingleItemDescription(segments[i]);
        } else {
          descriptionContent += this.getSegmentDescription(
            segments[i],
            allDescription,
            getSingleItemDescription,
            getIncrementDescriptionFormat,
            getRangeDescriptionFormat,
            getDescriptionFormat
          );
        }
      }

      if (!doesExpressionContainIncrement) {
        description = StringUtilities.format(getDescriptionFormat(expression), descriptionContent);
      } else {
        description = descriptionContent;
      }
    } else if (doesExpressionContainIncrement) {
      // Increment

      const segments: string[] = expression.split('/');
      description = StringUtilities.format(getIncrementDescriptionFormat(segments[1]), segments[1]);

      if (segments[0].indexOf('-') > -1) {
        // Range with Increment (ex: 2-59/3 )

        const rangeSegmentDescription: string = this.generateRangeSegmentDescription(
          segments[0],
          getRangeDescriptionFormat,
          getSingleItemDescription
        );

        if (rangeSegmentDescription.indexOf(', ') != 0) {
          description += ', ';
        }

        description += rangeSegmentDescription;
      } else if (segments[0].indexOf('*') == -1) {
        let rangeItemDescription: string = StringUtilities.format(
          getDescriptionFormat(segments[0]),
          getSingleItemDescription(segments[0])
        );

        // remove any leading comma
        rangeItemDescription = rangeItemDescription.replace(', ', '');

        description += StringUtilities.format(this.i18n.commaStartingX0(), rangeItemDescription);
      }
    } else if (doesExpressionContainRange) {
      // Range

      description = this.generateRangeSegmentDescription(
        expression,
        getRangeDescriptionFormat,
        getSingleItemDescription
      );
    }

    return description as string;
  }

  protected generateRangeSegmentDescription(
    rangeExpression: string,
    getRangeDescriptionFormat: (t: string) => string,
    getSingleItemDescription: (t: string) => string
  ): string {
    let description = '';
    const rangeSegments: string[] = rangeExpression.split('-');
    const rangeSegment1Description: string = getSingleItemDescription(rangeSegments[0]);
    let rangeSegment2Description: string = getSingleItemDescription(rangeSegments[1]);
    rangeSegment2Description = rangeSegment2Description.replace(':00', ':59');
    const rangeDescriptionFormat = getRangeDescriptionFormat(rangeExpression);
    description += StringUtilities.format(rangeDescriptionFormat, rangeSegment1Description, rangeSegment2Description);

    return description;
  }

  protected formatTime(hourExpression: string, minuteExpression: string, secondExpression: string): string {
    let hour: number = parseInt(hourExpression);
    let period = '';
    let setPeriodBeforeTime = false;
    if (!this.options.use24HourTimeFormat) {
      setPeriodBeforeTime = !!this.i18n.setPeriodBeforeTime && this.i18n.setPeriodBeforeTime();
      period = setPeriodBeforeTime ? `${this.getPeriod(hour)} ` : ` ${this.getPeriod(hour)}`;
      if (hour > 12) {
        hour -= 12;
      }
      if (hour === 0) {
        hour = 12;
      }
    }

    const minute = minuteExpression;
    let second = '';
    if (secondExpression) {
      second = `:${('00' + secondExpression).substring(secondExpression.length)}`;
    }

    return `${setPeriodBeforeTime ? period : ''}${('00' + hour.toString()).substring(hour.toString().length)}:${(
      '00' + minute.toString()
    ).substring(minute.toString().length)}${second}${!setPeriodBeforeTime ? period : ''}`;
  }

  protected transformVerbosity(description: string, useVerboseFormat: boolean): string {
    if (!useVerboseFormat) {
      description = description.replace(new RegExp(`, ${this.i18n.everyMinute()}`, 'g'), '');
      description = description.replace(new RegExp(`, ${this.i18n.everyHour()}`, 'g'), '');
      description = description.replace(new RegExp(this.i18n.commaEveryDay(), 'g'), '');
      description = description.replace(/, ?$/, '');
    }
    return description;
  }

  private getPeriod(hour: number): string {
    return hour >= 12 ? (this.i18n.pm && this.i18n.pm()) || 'PM' : (this.i18n.am && this.i18n.am()) || 'AM';
  }
}
