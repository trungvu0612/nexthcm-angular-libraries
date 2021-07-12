import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BranchesService } from '../../services/branches.service';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { UpsertBranchComponent } from '../upsert-branch/upsert-branch.component';
import { BranchList } from '../../models/branch';

@Component({
  selector: 'hcm-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchListComponent implements OnInit {
  @Input() request!: BranchList[];
  @Output() add = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() remove = new EventEmitter();
  page = 0;
  size = 10;

  // data$!: Observable<Pagination<BranchList>>;
  dataTest$ = this.branchesService.getBranchData({ size: 999}).pipe(shareReplay(1));

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
    console.log(this.dataTest$.subscribe((data) => console.log('resssssss', data)));

    combineLatest([this.page$, this.perPageSubject])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage]) => {
          return this.branchesService.getBranchDatas(page - 1, perpage);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        console.log(item);
        this.branchRes = item.items;
        this.totalLength = item.totalElements;
        this.cdr.detectChanges();
      });
  }

  onPage(page: number) {
    this.page$.next(page + 1);
  }

  onSize(size: number) {
    this.perPageSubject.next(size);
  }

  showDialog(): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertBranchComponent, this.injector), {
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
