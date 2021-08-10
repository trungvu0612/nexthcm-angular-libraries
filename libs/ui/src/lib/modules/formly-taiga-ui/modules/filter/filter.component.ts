import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {TuiBooleanHandler} from '@taiga-ui/cdk';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { ALWAYS_FALSE_HANDLER, TUI_DEFAULT_IDENTITY_MATCHER } from '@taiga-ui/cdk';

@Component({
  selector: 'formly-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent extends FieldType {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      badgeHandler: (item: unknown) => Number(item),
      disabledItemHandler: ALWAYS_FALSE_HANDLER,
      identityMatcher: TUI_DEFAULT_IDENTITY_MATCHER,
      size: 'l',
      single: false,
    },
  };

  disabledItemHandler: TuiBooleanHandler<string> = (item) => item.indexOf('0') > -1;

  onToggledItem(): void {
    if (this.to.single) {
      this.formControl.setValue([]);
    }
  }
}
