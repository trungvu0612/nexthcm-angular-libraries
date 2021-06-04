import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'hcm-add-seat-combo-box',
  templateUrl: './add-seat-combo-box.component.html',
  styleUrls: ['./add-seat-combo-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSeatComboBoxComponent extends FieldType {
  data$: Observable<any[]> = of([
    {
      id: 13,
      name: 'Le Vu',
      image: 'https://pbs.twimg.com/profile_images/1369877387949699074/tcvNQSr1.jpg',
    },
    {
      id: 13,
      name: 'Le Vu',
      image: 'https://pbs.twimg.com/profile_images/1369877387949699074/tcvNQSr1.jpg',
    },
    {
      id: 13,
      name: 'Le Vu',
      image: 'https://pbs.twimg.com/profile_images/1369877387949699074/tcvNQSr1.jpg',
    },
    {
      id: 13,
      name: 'Le Vu',
      image: 'https://pbs.twimg.com/profile_images/1369877387949699074/tcvNQSr1.jpg',
    },
  ]);

  defaultOptions = {
    templateOptions: {
      icon: null,
      stringify: (item: any) => item.name,
      textfieldCleaner: true,
    },
  };
}
