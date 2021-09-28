import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { APIDefinition } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbstractTransitionOptionListComponent } from '../../abstract-components/abstract-transition-option-list.component';
import { TransitionValidator } from '../../models';
import { loadValidatorTypes } from '../../state';
import { AddValidatorToTransitionDialogComponent } from '../add-validator-to-transition-dialog/add-validator-to-transition-dialog.component';

@Component({
  selector: 'hcm-transition-validator-list',
  templateUrl: './transition-validator-list.component.html',
  styleUrls: ['./transition-validator-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransitionValidatorListComponent extends AbstractTransitionOptionListComponent<TransitionValidator> {
  @ViewChild('table') table!: APIDefinition;
  @Input() data: TransitionValidator[] = [];
  @Output() dataChange = new EventEmitter<TransitionValidator[]>();

  constructor(
    readonly translocoService: TranslocoService,
    readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(TRANSLOCO_SCOPE) readonly scope: TranslocoScope,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private destroy$: TuiDestroyService,
    actions: Actions
  ) {
    super(translocoService, changeDetectorRef, scope);
    actions.dispatch(loadValidatorTypes());
  }

  openAddOptionToTransitionDialog(item?: TransitionValidator): Observable<TransitionValidator> {
    return this.dialogService
      .open<TransitionValidator>(new PolymorpheusComponent(AddValidatorToTransitionDialogComponent, this.injector), {
        size: 'l',
        data: { items: this.data, item },
      })
      .pipe(takeUntil(this.destroy$));
  }
}
