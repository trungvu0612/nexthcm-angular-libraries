import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Requests, SearchRequest } from '../../../../models/requests';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { MyRequestService } from '../../../../services/my-request.service';
import { TuiDialogService } from '@taiga-ui/core';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { TuiDestroyService, TuiMonth } from '@taiga-ui/cdk';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'hcm-list-ot-request',
  templateUrl: './list-ot-request.component.html',
  styleUrls: ['./list-ot-request.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOtRequestComponent implements OnInit {
  requests!: Requests[];
  readonly columns = ['fromDate', 'toDate', 'state', 'assignedName', 'reason', 'action'];
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);
  perPage$ = this.perPageSubject.asObservable();
  searchSubject = new BehaviorSubject<SearchRequest>({});
  searchForm!: FormGroup<{ month: TuiMonth }>;
  model!: SearchRequest;
  fields: FormlyFieldConfig[] = [
    {
      key: 'month',
      type: 'input-month',
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup<{ month: TuiMonth }>({
      month: new FormControl<TuiMonth>(new TuiMonth(0, 0)),
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
        this.cdr.detectChanges();
      });
  }

  onPage(page: number) {
    this.page$.next(page + 1);
  }

  onSize(size: number) {
    this.perPageSubject.next(size);
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      const date = new Date(this.searchForm.getRawValue().month.year, this.searchForm.getRawValue().month.month),
        y = date.getFullYear(),
        m = date.getMonth();
      const firstDay = new Date(y, m, 1);
      const lastDay = new Date(y, m + 1, 0);
      this.searchSubject.next({ fromDate: firstDay.toISOString(), toDate: lastDay.toISOString() });
    }
  }
}
