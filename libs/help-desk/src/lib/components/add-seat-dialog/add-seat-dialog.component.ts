import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';

interface Person {
  cif: string;
  number: string;
  fullName: string;
  image: string;
}

@Component({
  selector: 'hcm-add-seat-dialog',
  templateUrl: './add-seat-dialog.component.html',
  styleUrls: ['./add-seat-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSeatDialogComponent implements OnInit {
  data$: Observable<Partial<Person>[]> = of([
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
  form = new FormGroup({});
  model: { seats: Partial<Person>[] } = {
    seats: [{}],
  };
  fields: FormlyFieldConfig[] = [
    {
      key: 'seats',
      type: 'repeat',
      fieldArray: {
        fieldGroup: [
          {
            key: 'cif',
            type: 'input-autocomplete',
            templateOptions: {
              icon: 'assets/icons/search.svg',
              label: 'Search by CIF, Full Name',
              labelProp: 'fullName',
              idProp: 'cif',
              textfieldCleaner: true,
              textfieldLabelOutside: true,
              options: this.data$,
            },
          },
          {
            key: 'number',
            type: 'input',
            templateOptions: {
              icon: 'assets/icons/seat-position.svg',
              title: 'Seat number',
              textfieldCleaner: true,
              textfieldLabelOutside: true,
            },
          },
        ],
      },
    },
  ];

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext) {}

  ngOnInit(): void {}

  close(): void {
    this.context.completeWith();
  }

  submit(): void {
    console.log('submit', this.form.value.seats);
  }
}
