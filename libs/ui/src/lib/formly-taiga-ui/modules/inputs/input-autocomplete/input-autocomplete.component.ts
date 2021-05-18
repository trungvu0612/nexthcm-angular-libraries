import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'hcm-input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
  styleUrls: ['./input-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAutocompleteComponent extends FieldType {
  items$: Observable<any[]> = this.to.options as Observable<any[]>;
  defaultOptions = {
    templateOptions: {
      stringify: (item: any) => item[this.to.labelProp],
    },
  };
}
