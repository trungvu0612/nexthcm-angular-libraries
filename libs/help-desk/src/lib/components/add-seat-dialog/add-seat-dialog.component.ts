import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { SeatInfo } from '../../models';

@Component({
  selector: 'hcm-add-seat-dialog',
  templateUrl: './add-seat-dialog.component.html',
  styleUrls: ['./add-seat-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSeatDialogComponent {
  form = new FormGroup({});
  model: { seat?: Partial<SeatInfo>; seatNumber?: number } = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'seat',
      type: 'custom-combo-box',
      templateOptions: {
        icon: 'assets/icons/search.svg',
        title: 'Search by CIF, Full Name',
        nameProp: 'name',
        idProp: 'id',
      },
    },
    {
      key: 'seatNumber',
      type: 'input',
      templateOptions: {
        icon: 'assets/icons/seat-position.svg',
        title: 'Seat number',
        required: true,
        textfieldCleaner: true,
        textfieldLabelOutside: true,
      },
    },
  ];

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<Partial<SeatInfo> | null>) {}

  close(): void {
    this.context.completeWith(null);
  }

  addSeat(): void {
    this.context.completeWith(Object.assign(this.model.seat, { seatNumber: this.model.seatNumber }));
  }
}
