import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { TUI_DEFAULT_IDENTITY_MATCHER } from '@taiga-ui/cdk';
import { TuiIdentityMatcher } from '@taiga-ui/cdk/types';

@Component({
  selector: 'formly-multi-select',
  templateUrl: './multi-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectComponent extends FieldType {
  defaultOptions = {
    templateOptions: {
      textfieldSize: 'l',
      labelProp: 'name',
      textfieldLabelOutside: true,
      matcherBy: 'default',
      stringify: (item: any) => item.name,
      editable: false,
    },
  };

  readonly matcher: { [p: string]: TuiIdentityMatcher<any> } = {
    default: TUI_DEFAULT_IDENTITY_MATCHER,
    id: (i1, i2) => i1.id === i2.id,
  };
}
