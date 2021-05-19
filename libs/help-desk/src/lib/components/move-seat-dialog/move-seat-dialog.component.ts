import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';

@Component({
  selector: 'hcm-move-seat-dialog',
  templateUrl: './move-seat-dialog.component.html',
  styleUrls: ['./move-seat-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveSeatDialogComponent implements OnInit {
  inputSeatNumber = new FormControl<string>();
  availableSeats: any[] = this.context.data;

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<any, any>) {}

  ngOnInit(): void {}

  submit(): void {
    this.context.completeWith('submit');
    console.log('delete');
  }

  stringify = (item: any) => String(item.id);
}
