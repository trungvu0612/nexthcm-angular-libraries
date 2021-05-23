import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { Dispatch, SeatInfo } from '../../models/seat-map';

@Component({
  selector: 'hcm-add-seat-dialog',
  templateUrl: './add-seat-dialog.component.html',
  styleUrls: ['./add-seat-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSeatDialogComponent implements OnInit {
  form = new FormGroup({});
  model: { seats: Partial<SeatInfo>[] } = {
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

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<Dispatch<Partial<SeatInfo>>, number>) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model.seats[0].id = this.context.data;
    }
  }

  close(): void {
    this.context.completeWith({ type: 'close' });
  }

  addSeat(): void {
    this.context.completeWith({ type: 'add', payload: this.form.value.seats });
  }
}
