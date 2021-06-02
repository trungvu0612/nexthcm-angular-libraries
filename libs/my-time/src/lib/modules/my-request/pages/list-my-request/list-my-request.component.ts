import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { PagingResponse } from '@nexthcm/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Requests, SearchRequest } from '../../../../models/requests';
import { MyRequestService } from '../../../../services/my-request.service';
import { MY_REQUEST_PAGINATOR } from '../../../../state/my-request/my-request.paginator';
import { MyRequestState } from '../../../../state/my-request/my-request.store';
import { RequestsDialogComponent } from '../../components/requests-dialog/requests-dialog.component';

@Component({
  selector: 'hcm-list-my-request',
  templateUrl: './list-my-request.component.html',
  styleUrls: ['./list-my-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListMyRequestComponent implements OnInit {
  leaveTypes!: Requests[];
  readonly columns = ['type', 'fromDate', 'toDate', 'reason', 'action'];
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = this.paginatorRef.metadata.get('perPage') || 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);
  perPage$ = this.perPageSubject.asObservable();
  searchSubject = new BehaviorSubject<SearchRequest>({ type: '' });
  searchForm!: FormGroup<SearchRequest>;

  constructor(
    @Inject(MY_REQUEST_PAGINATOR) public paginatorRef: PaginatorPlugin<MyRequestState>,
    private myRequestService: MyRequestService,
    private formBuilder: FormBuilder,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group<SearchRequest>({
      type: '',
    });
    combineLatest([
      combineLatest([this.searchSubject, this.perPage$]).pipe(
        tap(() => {
          this.paginatorRef.clearCache();
          this.paginatorRef.setFirstPage();
        })
      ),
      this.paginatorRef.pageChanges,
    ])
      .pipe(
        switchMap(([[search, perPage], page]) => {
          this.paginatorRef.metadata.set('perPage', perPage);
          const requestFn = () =>
            this.myRequestService.getMyRequests(page - 1, perPage, search).pipe(
              map(
                (res: PagingResponse<Requests>) =>
                  ({
                    perPage,
                    lastPage: res.totalPages,
                    total: res.totalElements,
                    currentPage: page,
                    data: res.items,
                  } as PaginationResponse<Requests>)
              )
            );
          return this.paginatorRef.getPage(requestFn);
        })
      )
      .subscribe((pagination) => {
        this.totalLength = pagination.total || 0;
        this.leaveTypes = pagination.data;
        this.cdr.detectChanges();
      });
  }

  onPage(page: number) {
    this.page$.next(page + 1);
    this.paginatorRef.setPage(page + 1);
  }

  onSize(size: number) {
    this.perPageSubject.next(size);
  }

  onSearch(): void {
    this.searchSubject.next(this.searchForm.getRawValue());
  }

  cancel(): void {
    console.log('cancel');
  }

  showDialog(): void {
    const title = 'Title';
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(RequestsDialogComponent, this.injector), {
        closeable: false,
        data: { title },
      })
      .subscribe((cancel) => {
        if (cancel) this.cancel();
      });
  }
}
