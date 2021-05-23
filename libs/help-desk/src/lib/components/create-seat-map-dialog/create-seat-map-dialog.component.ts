import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { takeUntil } from 'rxjs/operators';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject } from 'rxjs';
import { SeatInfo } from '../../models/seat-map';

@Component({
  selector: 'hcm-create-seat-map',
  templateUrl: './create-seat-map.component.html',
  styleUrls: ['./create-seat-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CreateSeatMapDialogComponent implements OnInit {
  map$ = new BehaviorSubject<Partial<SeatInfo>[][]>([[{ status: 'none' }]]);
  typeCell = new FormControl<string>('empty');
  form = new FormGroup<{ [key: string]: number }>({});
  model = { x: 1, y: 1 };
  fields: FormlyFieldConfig[] = [
    {
      key: 'x',
      type: 'input-count',
      className: 'w-28 mr-12',
      templateOptions: {
        label: 'Columns',
      },
    },
    {
      key: 'y',
      type: 'input-count',
      className: 'w-28',
      templateOptions: {
        label: 'Rows',
      },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<Partial<SeatInfo>[][]>,
    private destroy$: TuiDestroyService
  ) {}

  ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((size) => {
      const map = Array.from({ length: size.y }, () => Array.from({ length: size.x }, () => ({ status: 'none' })));
      this.map$.next(map);
    });
  }

  changeType(x: number, y: number): void {
    const map = this.map$.value;
    map[y][x].status = this.typeCell.value;
    this.map$.next(map);
  }

  submit(): void {
    let count = 0;
    const map = this.map$.value;
    map.forEach((row) => {
      row.forEach((cell) => {
        if (cell.status === 'none') {
          cell.id = ++count;
        }
      });
    });
    this.context.completeWith(map);
  }
}
