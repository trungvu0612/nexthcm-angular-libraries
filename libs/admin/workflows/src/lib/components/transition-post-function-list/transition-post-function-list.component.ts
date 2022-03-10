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
import { TransitionPostFunction } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { AddPostFunctionToTransitionDialogComponent } from '../add-post-function-to-transition-dialog/add-post-function-to-transition-dialog.component';

@Component({
  selector: 'hcm-transition-post-function-list',
  templateUrl: './transition-post-function-list.component.html',
  styleUrls: ['./transition-post-function-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransitionPostFunctionListComponent extends AbstractTransitionOptionListComponent<TransitionPostFunction> {
  @ViewChild('table') table!: APIDefinition;
  @Input() data: TransitionPostFunction[] = [];
  @Output() dataChange = new EventEmitter<TransitionPostFunction[]>();

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
    adminWorkflowsService.doLoadPostFunctionTypes();
  }

  openAddOptionToTransitionDialog(item?: TransitionPostFunction): Observable<TransitionPostFunction> {
    return this.dialogService
      .open<TransitionPostFunction>(
        new PolymorpheusComponent(AddPostFunctionToTransitionDialogComponent, this.injector),
        {
          size: 'l',
          data: { items: this.data, item },
        }
      )
      .pipe(takeUntil(this.destroy$));
  }
}
