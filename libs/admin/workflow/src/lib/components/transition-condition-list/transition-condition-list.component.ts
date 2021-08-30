import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { APIDefinition } from 'ngx-easy-table';
import { Observable } from 'rxjs';
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
export class TransitionConditionListComponent extends AbstractTransitionOptionListComponent<TransitionCondition> {
  @ViewChild('table') table!: APIDefinition;
  @Input() data: TransitionCondition[] = [];
  @Output() dataChange = new EventEmitter<TransitionCondition[]>();

  constructor(
    readonly translocoService: TranslocoService,
    readonly changeDetectorRef: ChangeDetectorRef,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly destroy$: TuiDestroyService
  ) {
    super(translocoService, changeDetectorRef);
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
