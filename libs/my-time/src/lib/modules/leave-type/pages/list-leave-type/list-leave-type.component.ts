import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { PagingResponse } from '@nexthcm/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { LeaveType, SearchLeaveType } from '../../../../models/leave-type';
import { LeaveTypeService } from '../../../../services/leave-type.service';
import { LEAVE_TYPE_PAGINATOR } from '../../../../state/leave-type/leave-type.paginator';
import { LeaveTypeState } from '../../../../state/leave-type/leave-type.store';

interface User {
  readonly name: string;
  readonly email: string;
  readonly status: 'alive' | 'deceased';
  readonly tags: readonly string[];
}

@Component({
  selector: 'hcm-list-leave-type',
  templateUrl: './list-leave-type.component.html',
  styleUrls: ['./list-leave-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListLeaveTypeComponent implements OnInit {
  leaveTypes!: LeaveType[];
  readonly columns = ['name', 'action'];
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = this.paginatorRef.metadata.get('perPage') || 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);
  perPage$ = this.perPageSubject.asObservable();
  searchSubject = new BehaviorSubject<SearchLeaveType>({ name: '' });
  searchForm!: FormGroup<SearchLeaveType>;

  constructor(
    @Inject(LEAVE_TYPE_PAGINATOR) public paginatorRef: PaginatorPlugin<LeaveTypeState>,
    private leaveTypeService: LeaveTypeService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group<SearchLeaveType>({
      name: '',
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
            this.leaveTypeService.getLeaveTypes(page - 1, perPage, search).pipe(
              map(
                (res: PagingResponse<LeaveType>) =>
                  ({
                    perPage,
                    lastPage: res.totalPages,
                    total: res.totalElements,
                    currentPage: page,
                    data: res.items,
                  } as PaginationResponse<LeaveType>)
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
}
