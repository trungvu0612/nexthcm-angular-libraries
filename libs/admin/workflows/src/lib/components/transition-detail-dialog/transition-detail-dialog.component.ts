import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BaseOption } from '@nexthcm/cdk';
import { HashMap, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { ProviderScope, TranslocoScope } from '@ngneat/transloco/lib/types';
import { TuiContextWithImplicit, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransitionOptionIndex } from '../../enums';
import { Transition, TransitionDetailData } from '../../models';

@Component({
  selector: 'hcm-transition-detail-dialog',
  templateUrl: './transition-detail-dialog.component.html',
  styleUrls: ['./transition-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransitionDetailDialogComponent {
  activeItemIndex = this.context.data.index;
  readonly TransitionOptionIndex = TransitionOptionIndex;
  readonly conditionsOperators$: Observable<BaseOption<string>[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('CONDITIONS_OPERATORS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { label: result.or, value: 'OR' },
        { label: result.and, value: 'AND' },
      ])
    );

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<Transition, TransitionDetailData>,
    private readonly translocoService: TranslocoService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope
  ) {}

  get transition(): Transition {
    return this.context.data.transition;
  }

  @tuiPure
  stringify(items: BaseOption<string>[]): TuiStringHandler<TuiContextWithImplicit<string>> {
    const map = new Map(items.map(({ value, label }) => [value, label]));

    return ({ $implicit }: TuiContextWithImplicit<string>) => map.get($implicit) || '';
  }
}
