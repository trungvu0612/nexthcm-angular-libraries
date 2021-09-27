import { ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { Pagination, PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { LeaveRequest } from '../../models';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../services';
import { AbstractRequestListComponent } from '../shared/abstract-components/abstract-request-list.component';
import { SubmitLeaveRequestDialogComponent } from './components/submit-leave-request-dialog/submit-leave-request-dialog.component';

@Component({
  selector: 'hcm-my-leave',
  templateUrl: './my-leave.component.html',
  styleUrls: ['./my-leave.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class MyLeaveComponent extends AbstractRequestListComponent<LeaveRequest> {
  @ViewChild('table') table!: BaseComponent;
  readonly requestTypeUrlPath = RequestTypeAPIUrlPath.leave;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_LEAVE_TABLE_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'fromDate', title: result.dateRange },
        { key: 'leaveType', title: result.leaveType },
        {
          key: 'days',
          title: result.days,
          cssClass: { name: 'text-center', includeHeader: true },
          orderEnabled: false,
        },
        { key: 'status', title: result.status, orderEnabled: false },
        { key: 'comment', title: result.Comment, orderEnabled: false },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.myTimeService
        .getRequests<LeaveRequest>(RequestTypeAPIUrlPath.MyLeave, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly myTimeService: MyTimeService,
    readonly destroy$: TuiDestroyService,
    readonly state: RxState<Pagination<LeaveRequest>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly fb: FormBuilder,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService,
    private readonly authService: AuthService,
    private readonly dialogService: TuiDialogService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  get userId(): string {
    return this.authService.get('userInfo', 'userId');
  }

  showDialogSubmit(): void {
    this.dialogService
      .open(new PolymorpheusComponent(SubmitLeaveRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('myTime.submitLeaveRequest'),
        size: 'l',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        this.promptService.handleResponse('myTime.submitRequestSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
