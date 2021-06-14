import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Requests, SearchRequest } from '../../../../models/requests';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { MyRequestService } from '../../../../services/my-request.service';
import { TuiDialogService } from '@taiga-ui/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'hcm-list-working-outside',
  templateUrl: './list-working-outside.component.html',
  styleUrls: ['./list-working-outside.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListWorkingOutsideComponent implements OnInit {
  requests!: Requests[];
  readonly columns = ['type', 'fromDate', 'toDate', 'reason', 'action'];
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);
  perPage$ = this.perPageSubject.asObservable();
  searchSubject = new BehaviorSubject<SearchRequest>({});
  searchForm!: FormGroup<SearchRequest>;
  model!: SearchRequest;
  fields: FormlyFieldConfig[] = [
    {
      key: 'fromDate',
      type: 'input-date',
      templateOptions: {
        required: true,
        textfieldLabelOutside: true,
        placeholder: 'From Date',
      },
    },
    {
      key: 'toDate',
      type: 'input-date',
      templateOptions: {
        required: true,
        textfieldLabelOutside: true,
        placeholder: 'To Date',
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
    combineLatest([this.page$, this.perPageSubject, this.searchSubject])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage, search]) => {
          return this.myRequestService.geWorkingOutsideRequests(page - 1, perpage, search);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        this.requests = item.data.items;
        console.log(item);
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
    this.searchSubject.next(this.searchForm.getRawValue());
  }
}
