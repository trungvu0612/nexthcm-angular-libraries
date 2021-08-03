import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService, TuiMonth } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { endOfMonth, startOfMonth } from 'date-fns';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { Requests, SearchRequest } from '../../../models/requests';
import { MyRequestService } from '../../../services/my-request.service';
import { RequestDetailsWfhComponent } from '../request-details-wfh/request-details-wfh.component';

@Component({
  selector: 'hcm-list-work-from-home',
  templateUrl: './list-work-from-home.component.html',
  styleUrls: ['./list-work-from-home.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListWorkFromHomeComponent implements OnInit {
  myId = this.authService.get('userInfo').userId;
  today: Date = new Date();
  requests: Requests[] = [];
  readonly columns = ['fromDate', 'toDate', 'length', 'status', 'reason', 'userSendTo', 'action'];
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);
  searchSubject = new BehaviorSubject<SearchRequest>({});
  searchForm!: FormGroup<{ month: TuiMonth }>;
  model!: SearchRequest;
  STATUS: { [key: string]: string } = {
    '-1': 'rejected',
    '0': 'pending',
    '1': 'approved',
    '2': 'waiting',
    '3': 'taken',
    '4': 'weekend',
    '5': 'holiday',
  };
  fields: FormlyFieldConfig[] = [
    {
      key: 'month',
      type: 'input-month',
      defaultValue: new TuiMonth(this.today.getFullYear(), this.today.getMonth()),
      templateOptions: {
        required: true,
        textfieldLabelOutside: true,
        tuiTextfieldInputMode: 'numeric',
        placeholder: 'Select Month',
      },
    },
  ];

  constructor(
    private myRequestService: MyRequestService,
    private formBuilder: FormBuilder,
    private dialogService: TuiDialogService,
    private destroy$: TuiDestroyService,
    private injector: Injector,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {
    this.searchForm = new FormGroup<{ month: TuiMonth }>({
      month: new FormControl<TuiMonth>(new TuiMonth(this.today.getFullYear(), this.today.getMonth())),
    });
  }

  ngOnInit(): void {
    this.searchSubject.next({
      fromDate: startOfMonth(this.today).valueOf(),
      toDate: endOfMonth(this.today).valueOf(),
    });

    combineLatest([this.page$, this.perPageSubject, this.searchSubject])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage, search]) => {
          return this.myRequestService.getWorkFromHome(page - 1, perpage, search, this.myId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        this.requests = item.data.items;
        this.totalLength = item.data.totalElements;
        this.cdr.markForCheck();
      });
  }

  onClick(): void {
    if (this.searchForm.valid) {
      const date = new Date(this.searchForm.value.month?.year, this.searchForm.value.month?.month);
      this.searchSubject.next({
        fromDate: startOfMonth(date).toISOString(),
        toDate: endOfMonth(date).toISOString(),
      });
    }
  }

  onPage(page: number) {
    this.page$.next(page + 1);
  }

  onSize(size: number) {
    this.perPageSubject.next(size);
  }

  cancelReq(req: Requests): void {
    // req.state = -1;
    // this.myRequestService.editWorkingOutsideRequest(req, req.id as string).subscribe((item) => {
    //   console.log(item);
    // });
  }

  approveReq(req: Requests): void {
    // req.state = 1;
    // this.myRequestService.editOTRequest(req, req.id as string).subscribe((item) => {
    //   console.log(item);
    // });
  }

  showDetail(id: any): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(RequestDetailsWfhComponent, this.injector), {
        closeable: false,
        data: id,
      })
      .subscribe();
  }

  showLeaveDetail(req: any): void {
    this.router.navigateByUrl('/my-time/my-request/' + req + '/detail');
  }
}
