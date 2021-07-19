import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { TuiIdentityMatcher } from '@taiga-ui/cdk/types';
import { TUI_DEFAULT_IDENTITY_MATCHER } from '@taiga-ui/cdk';

@Component({
  selector: 'formly-multi-select',
  templateUrl: './multi-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectComponent extends FieldType {
  defaultOptions = {
    templateOptions: {
      textfieldSize: 'l',
      labelProp: 'label',
      textfieldLabelOutside: true,
      matcherBy: 'default',
      stringify: (item: any) => item.name,
    },
  };

  readonly matcher: { [p: string]: TuiIdentityMatcher<unknown> } = {
    default: TUI_DEFAULT_IDENTITY_MATCHER,
    id: (i1: any, i2: any) => i1.id === i2.id,
  };
}
