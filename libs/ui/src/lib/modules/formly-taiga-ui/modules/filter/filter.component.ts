import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { ALWAYS_FALSE_HANDLER, TUI_DEFAULT_IDENTITY_MATCHER } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-formly-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      badgeHandler: (item: unknown) => Number(item),
      disabledItemHandler: ALWAYS_FALSE_HANDLER,
      identityMatcher: TUI_DEFAULT_IDENTITY_MATCHER,
      size: 'm',
      single: false,
      options: [],
    },
  };

  onToggledItem(): void {
    if (this.to['single']) this.formControl?.setValue([]);
  }
}
