import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';

interface Person {
  cif: string;
  fullName: string;
  image: string;
}

@Component({
  selector: 'hcm-input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
  styleUrls: ['./input-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAutocompleteComponent extends FieldType {
  data$: Observable<Person[]> = of([
    {
      cif: '01240083',
      fullName: 'Le Tuan Vu',
      image: 'https://pbs.twimg.com/profile_images/1369877387949699074/tcvNQSr1.jpg',
    },
    {
      cif: '01240083',
      fullName: 'Le Tuan Vu',
      image: 'https://pbs.twimg.com/profile_images/1369877387949699074/tcvNQSr1.jpg',
    },
    {
      cif: '01240083',
      fullName: 'Le Tuan Vu',
      image: 'https://pbs.twimg.com/profile_images/1369877387949699074/tcvNQSr1.jpg',
    },
    {
      cif: '01240083',
      fullName: 'Le Tuan Vu',
      image: 'https://pbs.twimg.com/profile_images/1369877387949699074/tcvNQSr1.jpg',
    },
  ]);

  defaultOptions = {
    templateOptions: {
      stringify: (item: any) => item.fullName,
    },
  };
}
