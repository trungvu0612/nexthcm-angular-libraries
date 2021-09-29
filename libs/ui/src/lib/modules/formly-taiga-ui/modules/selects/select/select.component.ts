import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import {
  isNativeFocused,
  TUI_DEFAULT_IDENTITY_MATCHER,
  TuiContextWithImplicit,
  tuiPure,
  TuiStringHandler,
} from '@taiga-ui/cdk';
import { TuiIdentityMatcher } from '@taiga-ui/cdk/types';
import { TuiValueContentContext } from '@taiga-ui/core';

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
    return this.to.matcherBy
      ? (i1: any, i2: any) => i1[this.to.matcherBy] === i2[this.to.matcherBy]
      : TUI_DEFAULT_IDENTITY_MATCHER;
  }

  @tuiPure
  stringify(items: ReadonlyArray<any>): TuiStringHandler<TuiContextWithImplicit<any>> {
    const map = new Map(items.map((item) => [item[this.to.valueProp], item[this.to.labelProp]]));
    return ({ $implicit }: TuiContextWithImplicit<any>) => map.get($implicit) || '';
  }

  getSubLabel(item: any): string | undefined {
    return (
      this.to.subLabelProp &&
      this.to.subLabelProp.split('.').reduce((acc: any, cur: any) => (acc && acc[cur]) || null, item)
    );
  }

  getContext($implicit: any, { nativeElement }: ElementRef): TuiValueContentContext<any> {
    return { $implicit, active: isNativeFocused(nativeElement) };
  }
}
