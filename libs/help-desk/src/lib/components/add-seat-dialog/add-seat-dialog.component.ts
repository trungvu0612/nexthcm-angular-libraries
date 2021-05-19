import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';

interface Person {
  cif: string;
  number: string;
}

@Component({
  selector: 'hcm-add-seat-dialog',
  templateUrl: './add-seat-dialog.component.html',
  styleUrls: ['./add-seat-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSeatDialogComponent implements OnInit {
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
            type: 'custom-combo-box',
            templateOptions: {
              icon: 'assets/icons/search.svg',
              title: 'Search by CIF, Full Name',
              nameProp: 'fullName',
              idProp: 'cif',
              textfieldCleaner: true,
              textfieldLabelOutside: true,
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

  ngOnInit(): void {
    if (this.context.data) {
      this.model.seats[0].number = this.context.data;
    }
  }

  close(): void {
    this.context.completeWith();
  }

  submit(): void {
    console.log('submit', this.form.value.seats);
  }
}
