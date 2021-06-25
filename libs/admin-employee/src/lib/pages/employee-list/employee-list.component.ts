import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { SearchEmployee, User } from '../../models/user';
import { AdminEmployeeService } from '../../services/admin-employee.service';

@Component({
  selector: 'hcm-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class EmployeeListComponent implements OnInit {
  searchEmployee = new BehaviorSubject<SearchEmployee>({ name: '' });
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);

  readonly testForm = new FormGroup({
    testValue: new FormControl([new TuiDay(2011, 6, 4), null]),
    dateCreated: new FormControl(),
    searchEmployee: new FormControl(),
  });
  columns = ['id', 'fullName', 'phone', 'workingTime', 'address', 'salary', 'status', 'action'];
  data: Partial<User>[] = [];
  constructor(
    private AdminEmployeeService: AdminEmployeeService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private destroy$: TuiDestroyService
  ) {}

  ngOnInit(): void {
    const request$ = combineLatest([this.page$, this.perPageSubject, this.searchEmployee])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage, search]) => {
          return this.AdminEmployeeService.getEmployee(page - 1, perpage, search);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        console.log(item.data.items);
        this.data = item.data.items;
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
}
