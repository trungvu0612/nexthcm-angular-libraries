import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Requests, SearchRequest } from '../../../../models/requests';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { MyRequestService } from '../../../../services/my-request.service';
import { TuiDialogService } from '@taiga-ui/core';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { TuiDestroyService, TuiMonth } from '@taiga-ui/cdk';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldConfigCache } from '@ngx-formly/core/lib/components/formly.field.config';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { RequestDetailsComponent } from '../../components/request-details/request-details.component';

@Component({
  selector: 'hcm-list-ot-request',
  templateUrl: './list-ot-request.component.html',
  styleUrls: ['./list-ot-request.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListOtRequestComponent implements OnInit {
  today: Date = new Date();
  requests: Requests[] = [];
  readonly columns = ['fromDate', 'toDate', 'state', 'assignedName', 'reason', 'action'];
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);
  perPage$ = this.perPageSubject.asObservable();
  searchSubject = new BehaviorSubject<SearchRequest>({});
  searchForm!: FormGroup<{ month: TuiMonth }>;
  model!: SearchRequest;
  STATUS: { [key: string]: string } = {
    '-1': 'rejected',
    '0': 'pending',
    '1': 'approved',
    '2': 'scheduled',
    '3': 'taken',
    '4': 'weekend',
    '5': 'holiday'
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
        fieldChange: (field: FormlyFieldConfigCache) => {
          console.log(field);
        }
      }
    }
  ];

  constructor(
    private myRequestService: MyRequestService,
    private formBuilder: FormBuilder,
    private dialogService: TuiDialogService,
    private destroy$: TuiDestroyService,
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = new FormGroup<{ month: TuiMonth }>({
      month: new FormControl<TuiMonth>(new TuiMonth(this.today.getFullYear(), this.today.getMonth()))
    });
  }

  ngOnInit(): void {
    this.searchSubject.next({
      fromDate: startOfMonth(this.today).toISOString(),
      toDate: endOfMonth(this.today).toISOString()
    });
    combineLatest([this.page$, this.perPageSubject, this.searchSubject])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage, search]) => {
          return this.myRequestService.getMyOtRequests(page - 1, perpage, search);
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
        toDate: endOfMonth(date).toISOString()
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
    req.state = -1;
    this.myRequestService.editOTRequest(req, req.id as string).subscribe(item => {
      console.log(item);
    });
  }

  approveReq(req: Requests): void {
    req.state = 1;
    this.myRequestService.editOTRequest(req, req.id as string).subscribe(item => {
      console.log(item);
    });
  }

  showDetail(req: Requests): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(RequestDetailsComponent, this.injector), {
        closeable: false,
        data: { type: 'timesheet', req: req }
      })
      .subscribe((cancel) => {
        console.log(cancel);
      });
  }

}
