import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { Pagination, PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
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

  readonly userId = this.authService.get('userInfo', 'userId');
  readonly requestTypeUrlPath = RequestTypeAPIUrlPath.leave;
  readonly columns$: Observable<Columns[]> = this.translocoService.selectTranslateObject('MY_LEAVE_TABLE_COLUMNS').pipe(
    map((result) => [
      { key: 'dateRange', title: result.dateRange },
      { key: 'leaveType', title: result.leaveType },
      { key: 'days', title: result.days },
      { key: 'status', title: result.status },
      { key: 'comment', title: result.Comment },
      { key: 'functions', title: result.functions },
    ])
  );
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams().set('page', 0).set('size', 10).set('userId', this.authService.get('userInfo', 'userId'))
  );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.myTimeService
        .getRequests<LeaveRequest>(this.requestTypeUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    share()
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    public myTimeService: MyTimeService,
    public destroy$: TuiDestroyService,
    public state: RxState<Pagination<LeaveRequest>>,
    private fb: FormBuilder,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService,
    private authService: AuthService,
    private dialogService: TuiDialogService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  showDialogSubmit(): void {
    this.dialogService
      .open(new PolymorpheusComponent(SubmitLeaveRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('submitLeaveRequest'),
        size: 'l',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        this.promptService.handleResponse('submitRequestSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
