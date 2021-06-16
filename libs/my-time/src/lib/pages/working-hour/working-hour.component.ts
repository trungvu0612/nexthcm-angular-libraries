import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { RequestOtComponent } from '../../components/request-ot/request-ot.component';
import { WorkingOutsiteComponent } from '../../components/working-outsite/working-outsite.component';
import { SearchWorkingHour, WorkingHour } from '../../models/working-hour';
import { WorkingHourService } from '../../services/working-hour.service';

@Component({
  selector: 'hcm-working-hour',
  templateUrl: './working-hour.component.html',
  styleUrls: ['./working-hour.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkingHourComponent implements OnInit {
  workingMeStatus = true;
  WorkingHourData!: WorkingHour[];
  WorkingHourDataOnlyMe!: WorkingHour[];
  searchForm!: FormGroup<SearchWorkingHour>;
  searchWorkingHour = new BehaviorSubject<SearchWorkingHour>({ name: '' });
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);

  readonly onlyme_columns = [
    'office',
    'date',
    'day',
    'timeIn',
    'timeOut',
    'totalWorkingTime',
    'workingDay',
    'ot',
    'onsiteDay',
    'leave',
    'action',
  ];
  readonly everyone_columns = [
    'cif',
    'fullName',
    'office',
    'date',
    'day',
    'timeIn',
    'timeOut',
    'totalWorkingTime',
    'workingDay',
    'action',
  ];

  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private workingHourService: WorkingHourService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private destroy$: TuiDestroyService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group<SearchWorkingHour>({
      name: '',
    });
    const request$ = combineLatest([this.page$, this.perPageSubject, this.searchWorkingHour])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage, search]) => {
          return this.workingHourService.getWorkingHourOnlyMe(page - 1, perpage, search);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        this.WorkingHourDataOnlyMe = item.data.items;
        this.totalLength = item.data.totalElements;
        this.cdr.detectChanges();
      });
  }

  workingStatus(type: string) {
    if (type == 'me') {
      this.workingMeStatus = true;
    }
    if (type == 'all') {
      this.workingMeStatus = false;
      const request$ = combineLatest([this.page$, this.perPageSubject, this.searchWorkingHour])
        .pipe(
          debounceTime(0),
          switchMap(([page, perpage, search]) => {
            return this.workingHourService.getWorkingHour(page - 1, perpage, search);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe((item) => {
          this.WorkingHourData = item.data.items;
          this.totalLength = item.data.totalElements;
          this.cdr.detectChanges();
        });
    }
  }

  requestOT(): void {
    this.dialogService
      .open(new PolymorpheusComponent(RequestOtComponent, this.injector), {
        size: 'm',
        closeable: false,
      })
      .subscribe((map) => {
        this.cdr.detectChanges();
      });
  }

  workingOutsite(): void {
    this.dialogService
      .open(new PolymorpheusComponent(WorkingOutsiteComponent, this.injector), {
        size: 'm',
        closeable: false,
      })
      .subscribe((map) => {
        this.cdr.detectChanges();
      });
  }

  onSearch(): void {}

  onPage(page: number) {
    this.page$.next(page + 1);
  }

  onSize(size: number) {
    this.perPageSubject.next(size);
  }
}
