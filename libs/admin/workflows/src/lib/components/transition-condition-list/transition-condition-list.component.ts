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
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { APIDefinition } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AbstractTransitionOptionListComponent } from '../../abstract-components/abstract-transition-option-list.component';
import { TransitionCondition } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { AddConditionToTransitionDialogComponent } from '../add-condition-to-transition-dialog/add-condition-to-transition-dialog.component';

@Component({
  selector: 'hcm-transition-condition-list',
  templateUrl: './transition-condition-list.component.html',
  styleUrls: ['./transition-condition-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class TransitionConditionListComponent extends AbstractTransitionOptionListComponent<TransitionCondition> {
  @ViewChild('table') table!: APIDefinition;
  @Input() data: TransitionCondition[] = [];
  @Output() dataChange = new EventEmitter<TransitionCondition[]>();

  constructor(
    @Inject(TRANSLOCO_SCOPE) override readonly translocoScope: ProviderScope,
    override readonly translocoService: TranslocoService,
    override readonly changeDetectorRef: ChangeDetectorRef,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly destroy$: TuiDestroyService,
    adminWorkflowsService: AdminWorkflowsService
  ) {
    super(translocoScope, translocoService, changeDetectorRef);
    adminWorkflowsService.doLoadConditionTypes();
  }

  openAddOptionToTransitionDialog(item?: TransitionCondition): Observable<TransitionCondition> {
    return this.dialogService
      .open<TransitionCondition>(new PolymorpheusComponent(AddConditionToTransitionDialogComponent, this.injector), {
        size: 'l',
        data: { items: this.data, item },
      })
      .pipe(takeUntil(this.destroy$));
  }
}
