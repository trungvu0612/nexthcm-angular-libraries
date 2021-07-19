import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { TUI_DEFAULT_IDENTITY_MATCHER } from '@taiga-ui/cdk';
import { TuiIdentityMatcher } from '@taiga-ui/cdk/types';

@Component({
  selector: 'formly-select',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent extends FieldType {
  defaultOptions = {
    templateOptions: {
      textfieldSize: 'l',
      textfieldLabelOutside: true,
      labelProp: 'label',
      matcherBy: 'default',
    },
  };

  readonly matcher: { [p: string]: TuiIdentityMatcher<unknown> } = {
    default: TUI_DEFAULT_IDENTITY_MATCHER,
    id: (i1: any, i2: any) => i1.id === i2.id,
  };

  getSubLabel(item: any): string | undefined {
    return (
      this.to.subLabelProp &&
      this.to.subLabelProp.split('.').reduce((acc: any, cur: any) => (acc && acc[cur]) || null, item)
    );
  }
}
