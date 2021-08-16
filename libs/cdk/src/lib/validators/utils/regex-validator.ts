export class RegexValidator {
  static isExits(value: any, regex: RegExp): boolean {
    return value.match(regex) != null;
  }
  static isValid(value: any, regex: RegExp): boolean {
    return regex.test(value);
  }

  static isNotBlank(value: unknown, isRemoveSpace = false): boolean {
    return !isRemoveSpace
      ? value === 0 || (value !== undefined && value !== null && value !== '')
      : value === 0 || (value !== undefined && value !== null && String(value).trim() !== '');
  }

  static isZero(value: unknown): boolean {
    return value == 0;
  }

  static commaRegex(): RegExp {
    return new RegExp(",", "g");
  }
}
