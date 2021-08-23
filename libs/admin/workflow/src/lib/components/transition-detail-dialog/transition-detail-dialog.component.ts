import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Subject } from 'rxjs';
import { TransitionOptionIndex } from '../../enums';
import { Transition, TransitionDetailData } from '../../models';

@Component({
  selector: 'hcm-transition-detail-dialog',
  templateUrl: './transition-detail-dialog.component.html',
  styleUrls: ['./transition-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class TransitionDetailDialogComponent implements OnInit {
  activeItemIndex = this.context.data.index;
  readonly initHandler$ = new Subject<Transition>();
  readonly state$ = this.state.select();
  readonly TransitionOptionIndex = TransitionOptionIndex;

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<Transition, TransitionDetailData>,
    private readonly state: RxState<Transition>
  ) {
    state.connect(this.initHandler$);
  }

  ngOnInit(): void {
    this.initHandler$.next(this.context.data.transition);
  }
}
