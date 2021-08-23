import { ChangeDetectionStrategy, Component, Injector, Input } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';
import { AbstractTransitionOptionListComponent } from '../../abstract-components/abstract-transition-option-list.component';
import { TransitionValidator } from '../../models';
import { AddValidatorToTransitionDialogComponent } from '../add-validator-to-transition-dialog/add-validator-to-transition-dialog.component';

@Component({
  selector: 'hcm-transition-validator-list',
  templateUrl: './transition-validator-list.component.html',
  styleUrls: ['./transition-validator-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransitionValidatorListComponent extends AbstractTransitionOptionListComponent<TransitionValidator> {
  @Input() data: TransitionValidator[] = [];

  constructor(
    readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private destroy$: TuiDestroyService
  ) {
    super(translocoService);
  }

  onAddValidator(): void {
    this.dialogService
      .open(new PolymorpheusComponent(AddValidatorToTransitionDialogComponent, this.injector), { size: 'l' })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
