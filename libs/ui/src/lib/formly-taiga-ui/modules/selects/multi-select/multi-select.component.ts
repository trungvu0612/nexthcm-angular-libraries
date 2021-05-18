import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { TuiContextWithImplicit, TuiIdentityMatcher, TuiStringHandler } from '@taiga-ui/cdk';

@Component({
  selector: 'formly-multi-select',
  templateUrl: './multi-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectComponent extends FieldType implements OnInit {
  defaultOptions = {
    templateOptions: {
      options: [],
      textfieldSize: 'l',
      labelProp: 'label',
      valueProp: 'value',
      textfieldLabelOutside: true,
    },
  };
  stringify!: TuiStringHandler<any | TuiContextWithImplicit<any>>;
  identityMatcher!: TuiIdentityMatcher<any>;

  ngOnInit(): void {
    this.stringify = (item) =>
      this.to.valueProp
        ? item
        : this.to.labelProp in item
        ? item[this.to.labelProp]
        : item.$implicit[this.to.labelProp];
    this.identityMatcher = (item1, item2) =>
      this.to.valueProp ? item1 === item2 : item1[this.to.idProp] === item2[this.to.idProp];
  }
}
