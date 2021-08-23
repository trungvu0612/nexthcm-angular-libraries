import { ChangeDetectionStrategy, Component, Injector, Input } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';
import { AbstractTransitionOptionListComponent } from '../../abstract-components/abstract-transition-option-list.component';
import { TransitionPostFunction } from '../../models';
import { AddPostFunctionToTransitionDialogComponent } from '../add-post-function-to-transition-dialog/add-post-function-to-transition-dialog.component';

@Component({
  selector: 'hcm-transition-post-function-list',
  templateUrl: './transition-post-function-list.component.html',
  styleUrls: ['./transition-post-function-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransitionPostFunctionListComponent extends AbstractTransitionOptionListComponent<TransitionPostFunction> {
  @Input() data: TransitionPostFunction[] = [];

  constructor(
    readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private destroy$: TuiDestroyService
  ) {
    super(translocoService);
  }

  onAddPostFunction(): void {
    this.dialogService
      .open(new PolymorpheusComponent(AddPostFunctionToTransitionDialogComponent, this.injector), { size: 'l' })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
