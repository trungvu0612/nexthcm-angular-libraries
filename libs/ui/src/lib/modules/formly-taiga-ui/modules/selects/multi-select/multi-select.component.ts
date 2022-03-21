import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { ALWAYS_FALSE_HANDLER, TUI_DEFAULT_IDENTITY_MATCHER } from '@taiga-ui/cdk';
import { TuiIdentityMatcher } from '@taiga-ui/cdk/types';

@Component({
  selector: 'hcm-formly-multi-select',
  templateUrl: './multi-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectComponent extends FieldType {
  override defaultOptions = {
    templateOptions: {
      textfieldSize: 'l',
      labelProp: 'name',
      textfieldLabelOutside: true,
      matcherBy: 'default',
      stringify: (item: any) => item.name,
      editable: false,
      disabledItemHandler: ALWAYS_FALSE_HANDLER,
    },
  };

  readonly matcher: { [p: string]: TuiIdentityMatcher<any> } = {
    default: TUI_DEFAULT_IDENTITY_MATCHER,
    id: (i1, i2) => i1.id === i2.id,
  };
}
