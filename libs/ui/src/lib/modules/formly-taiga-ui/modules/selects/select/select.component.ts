import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { TUI_DEFAULT_IDENTITY_MATCHER, TuiContextWithImplicit, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
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
    },
  };

  get identityMatcher(): TuiIdentityMatcher<unknown> {
    if (!this.to.matcherBy) return TUI_DEFAULT_IDENTITY_MATCHER;
    return (i1: any, i2: any) => i1[this.to.matcherBy] === i2[this.to.matcherBy];
  }

  @tuiPure
  stringify(items: ReadonlyArray<any>): TuiStringHandler<TuiContextWithImplicit<any>> {
    const map = new Map(
      items.map((item) => [
        this.to.stringItem ? item : item[this.to.valueProp],
        this.to.stringItem ? item : item[this.to.labelProp],
      ])
    );
    return ({ $implicit }: TuiContextWithImplicit<any>) => map.get($implicit) || '';
  }

  getSubLabel(item: any): string | undefined {
    return (
      this.to.subLabelProp &&
      this.to.subLabelProp.split('.').reduce((acc: any, cur: any) => (acc && acc[cur]) || null, item)
    );
  }
}
