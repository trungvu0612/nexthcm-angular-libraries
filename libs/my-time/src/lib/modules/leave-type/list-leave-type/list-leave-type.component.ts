import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { LeaveType, SearchLeaveType } from '../../../models/leave-type';
import { LeaveTypeService } from '../../../services/leave-type.service';

@Component({
  selector: 'hcm-list-leave-type',
  templateUrl: './list-leave-type.component.html',
  styleUrls: ['./list-leave-type.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListLeaveTypeComponent implements OnInit {
  leaveTypes!: LeaveType[];
  readonly columns = ['name', 'action'];
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);
  searchSubject = new BehaviorSubject<SearchLeaveType>({ name: '' });
  searchForm!: FormGroup<SearchLeaveType>;

  constructor(
    private leaveTypeService: LeaveTypeService,
    private formBuilder: FormBuilder,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group<SearchLeaveType>({
      name: '',
    });
    const request$ = combineLatest([this.page$, this.perPageSubject, this.searchSubject])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage, search]) => {
          return this.leaveTypeService.getLeaveTypes(page - 1, perpage, search);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        this.leaveTypes = item.data.items;
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
