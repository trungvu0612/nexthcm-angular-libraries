import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { BaseWorkflow } from '@nexthcm/cdk';
import { FieldType } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ViewWorkflowDialogComponent } from '../view-workflow-dialog/view-workflow-dialog.component';

@Component({
  selector: 'hcm-formly-view-workflow-button',
  templateUrl: './formly-view-workflow-button.component.html',
  styleUrls: ['./formly-view-workflow-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class FormlyViewWorkflowButtonComponent extends FieldType {
  readonly view$ = new Subject<void>();

  constructor(
    private readonly state: RxState<Record<string, unknown>>,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector
  ) {
    super();
    this.state.hold(this.view$.pipe(switchMap(() => this.openViewWorkflowDialog(this.formControl.value))));
  }

  openViewWorkflowDialog(workflow: BaseWorkflow): Observable<unknown> {
    return this.dialogService.open(new PolymorpheusComponent(ViewWorkflowDialogComponent, this.injector), {
      label: workflow.name,
      data: workflow.template,
      size: 'page',
      dismissible: false,
    });
  }
}
