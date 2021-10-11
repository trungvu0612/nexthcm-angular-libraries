import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { CronUIBaseService, Type } from '@sbzen/cron-core';

@Directive()
export abstract class CronHostComponent implements ControlValueAccessor {
  @Output() changed = new EventEmitter<string>();
  @Output() tabChanged = new EventEmitter<Type>();
  @Input() activeTabIndex = 0;
  @Input() tabs = [Type.SECONDS, Type.MINUTES, Type.HOURS, Type.DAY, Type.MONTH, Type.YEAR];
  @Input() hideTabs = false;
  protected onChange?: (cronValue: string) => {};
  protected onTouched?: () => {};

  protected constructor(private readonly cronUI: CronUIBaseService) {}

  @Input() set disabled(value: unknown) {
    const disableFields = value != null && `${value}` !== 'false';
    this.cronUI.setDisabled(disableFields);
  }

  writeValue(cronValue: string): void {
    this.cronUI.fillFromExpression(cronValue || '');
  }

  registerOnChange(fn: (cronValue: string) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  applyChanges(): void {
    const str = this.cronUI.toString();
    if (this.onChange) {
      this.onChange(str);
    }
    if (this.onTouched) {
      this.onTouched();
    }
    this.changed.emit(str);
  }
}
