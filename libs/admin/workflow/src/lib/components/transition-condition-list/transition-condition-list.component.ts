import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';
import { AbstractTransitionOptionListComponent } from '../../abstract-components/abstract-transition-option-list.component';
import { TransitionCondition } from '../../models';
import { AddConditionToTransitionDialogComponent } from '../add-condition-to-transition-dialog/add-condition-to-transition-dialog.component';

@Component({
  selector: 'hcm-transition-condition-list',
  templateUrl: './transition-condition-list.component.html',
  styleUrls: ['./transition-condition-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class TransitionConditionListComponent
  extends AbstractTransitionOptionListComponent<TransitionCondition>
  implements OnInit
{
  @Input() data: TransitionCondition[] = [];

  constructor(
    readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private destroy$: TuiDestroyService
  ) {
    super(translocoService);
  }

  ngOnInit(): void {
    this.setTableRowsAmount();
  }

  onAddCondition(): void {
    this.dialogService
      .open(new PolymorpheusComponent(AddConditionToTransitionDialogComponent, this.injector))
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
