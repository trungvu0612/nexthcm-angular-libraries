import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import {
  TUI_DEFAULT_IDENTITY_MATCHER,
  TuiContextWithImplicit,
  TuiIdentityMatcher,
  tuiPure,
  TuiStringHandler,
} from '@taiga-ui/cdk';

@Component({
  selector: 'formly-select',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent extends FieldType {
  defaultOptions = {
    templateOptions: {
      options: [],
      textfieldSize: 'l',
      labelProp: 'label',
      valueProp: 'value',
      textfieldLabelOutside: true,
    },
  };

  get identityMatcher(): TuiIdentityMatcher<any> {
    return this.to.valueProp
      ? (item1, item2) => item1[this.to.valueProp] === item2[this.to.valueProp]
      : TUI_DEFAULT_IDENTITY_MATCHER;
  }

  @tuiPure
  stringify(items: ReadonlyArray<any>): TuiStringHandler<TuiContextWithImplicit<any>> {
    const map = new Map(
      items.map((item) => [this.to.valueProp ? item[this.to.valueProp] : item, item[this.to.labelProp]])
    );
    return ({ $implicit }: TuiContextWithImplicit<any>) => map.get($implicit) || '';
  }
}
