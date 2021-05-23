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
  inputSeatNumber = new FormControl<{ id: number }>();
  emptySeats: { id: number }[] = [];

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<number, unknown>) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.emptySeats = (this.context.data as any).flat().map((id: number) => ({ id }));
    }
  }

  submit(): void {
    this.context.completeWith(this.inputSeatNumber.value.id);
  }

  stringify = (item: any) => String(item.id);
}
