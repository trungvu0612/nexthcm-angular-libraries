import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { TuiContextWithImplicit, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';

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
