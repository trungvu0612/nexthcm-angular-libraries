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
import { TransitionPostFunction } from '../../models';
import { loadPostFunctionTypes } from '../../state';
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
    readonly translocoService: TranslocoService,
    readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(TRANSLOCO_SCOPE) readonly scope: TranslocoScope,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly destroy$: TuiDestroyService,
    actions: Actions
  ) {
    super(translocoService, changeDetectorRef, scope);
    actions.dispatch(loadPostFunctionTypes());
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
