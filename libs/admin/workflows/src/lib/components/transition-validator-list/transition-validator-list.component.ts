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
import { TransitionValidator } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';
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
    @Inject(TRANSLOCO_SCOPE) override readonly translocoScope: ProviderScope,
    override readonly translocoService: TranslocoService,
    override readonly changeDetectorRef: ChangeDetectorRef,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private destroy$: TuiDestroyService,
    adminWorkflowsService: AdminWorkflowsService
  ) {
    super(translocoScope, translocoService, changeDetectorRef);
    adminWorkflowsService.doLoadValidatorTypes();
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
