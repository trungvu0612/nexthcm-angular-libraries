import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BranchRes } from '../../models/branch';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BranchesService } from '../../services/branches.service';

@Component({
  selector: 'hcm-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchListComponent implements OnInit {
  @Input() request!: BranchRes[];
  @Output() add = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() remove = new EventEmitter();
  page = 0;
  size = 10;

  dataTest$?: Observable<any> = this.branchesService.getBranchDatas(0, 10).pipe(map((data) => data.data.items));

  columns = ['orgType', 'orgName', 'description', 'description', 'action'];

  branchRes!: BranchRes[];
  page$ = new BehaviorSubject<number>(1);
  size$ = 10;
  totalLength = 0;
  perPageSubject = new BehaviorSubject<number>(this.size$);

  constructor(
    private branchesService: BranchesService,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef
  ) {}

  get requestOnPage(): BranchRes[] {
    return this.request.slice(this.page * this.size, (this.page + 1) * this.size);
  }

  ngOnInit(): void {
    // console.log(this.dataTest$.subscribe((data) => console.log('res', data)));

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

  cancel(): void {
    console.log('cancel');
  }
}
