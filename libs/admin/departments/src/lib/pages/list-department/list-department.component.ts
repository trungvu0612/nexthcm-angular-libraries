import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BranchList } from '../../../../../branches/src/lib/models/branch';
import { shareReplay } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { BranchesService } from '../../../../../branches/src/lib/services/branches.service';
import { TuiDialogService } from '@taiga-ui/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { UpsertDepartmentComponent } from '../upsert-department/upsert-department.component';

@Component({
  selector: 'hcm-list-department',
  templateUrl: './list-department.component.html',
  styleUrls: ['./list-department.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListDepartmentComponent implements OnInit {
  @Input() request!: BranchList[];
  @Output() add = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() remove = new EventEmitter();
  page = 0;
  size = 10;

  // data$!: Observable<Pagination<BranchList>>;
  dataTest$ = this.branchesService.getBranchData({ size: 999 }).pipe(shareReplay(1));

  columns = ['orgType', 'orgName', 'description', 'description', 'action'];

  branchRes!: BranchList[];
  page$ = new BehaviorSubject<number>(1);
  size$ = 10;
  totalLength = 0;
  perPageSubject = new BehaviorSubject<number>(this.size$);

  constructor(
    private branchesService: BranchesService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef
  ) {}

  get requestOnPage(): BranchList[] {
    return this.request.slice(this.page * this.size, (this.page + 1) * this.size);
  }

  ngOnInit(): void {
    // console.log(this.dataTest$.subscribe((data) => console.log('resssssss', data)));
    //
    // combineLatest([this.pages$, this.perPageSubject])
    //   .pipe(
    //     debounceTime(0),
    //     switchMap(([pages, perpage]) => {
    //       return this.branchesService.getBranchDatas(pages - 1, perpage);
    //     }),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe((item) => {
    //     console.log(item);
    //     this.branchRes = item.items;
    //     this.totalLength = item.totalElements;
    //     this.cdr.detectChanges();
    //   });
  }

  onPage(page: number) {
    this.page$.next(page + 1);
  }

  onSize(size: number) {
    this.perPageSubject.next(size);
  }

  showDialog(): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertDepartmentComponent, this.injector), {
        // data: id,
      })
      .subscribe((data) => {
        // if (data) {
        //   const body = {
        //     status: 0,
        //   };
        //   // this.myLeaveService.editLeave(id, body).subscribe((data) => {
        //   //   console.log('susscess edit', id);
        //   // });
        // }
      });
  }

  cancel(): void {
    console.log('cancel');
  }
}
