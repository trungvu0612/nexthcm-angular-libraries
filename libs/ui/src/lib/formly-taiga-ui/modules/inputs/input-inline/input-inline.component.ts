import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-input-inline',
  templateUrl: './input-inline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputInlineComponent extends FieldType {
  editing = false;
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      icon: 'tuiIconEditLarge',
    },
  };

  toggle(): void {
    this.editing = !this.editing;
  }

  onFocusedChange(focused: boolean): void {
    if (!focused) {
      this.editing = false;
    }
  }
}
