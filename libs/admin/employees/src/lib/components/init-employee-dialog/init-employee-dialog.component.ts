import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { EmployeeGeneralInformation, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { from, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-init-employee-dialog',
  templateUrl: './init-employee-dialog.component.html',
  styleUrls: ['./init-employee-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitEmployeeDialogComponent {
  readonly submit$ = new Subject<EmployeeGeneralInformation>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.adminEmployeesService.initEmployee(payload).pipe(
        switchMap(() =>
          from(
            this.promptService.open({
              icon: 'success',
              html: this.translocoService.translate('employees.addEmployeeSuccessfully'),
            })
          )
        ),
        tap(() => this.context.completeWith()),
        catchError((err) =>
          from(this.promptService.open({ icon: 'error', html: this.promptService.generateErrorMessage(err) }))
        ),
        startWith(null)
      )
    ),
    share()
  );
  readonly submitLoading$ = this.submitHandler$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext,
    private readonly adminEmployeesService: AdminEmployeesService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService
  ) {}

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
