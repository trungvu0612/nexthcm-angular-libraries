import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { Policy } from '../../models/policy';
import { PoliciesService } from '../../policies.service';

@Component({
  selector: 'hcm-updated-detail',
  templateUrl: './updated-detail.component.html',
  styleUrls: ['./updated-detail.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatedDetailComponent implements OnInit {
  more = true;
  data: Policy[] = [];
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);
  searchSubject = new BehaviorSubject<Policy>({});
  searchForm!: FormGroup<Policy>;

  constructor(
    private destroy$: TuiDestroyService,
    private policiesService: PoliciesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    combineLatest([this.page$, this.perPageSubject, this.searchSubject])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage, search]) => {
          return this.policiesService.getPolicies(page - 1, perpage, search);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        this.data = item.data.items;
        this.totalLength = item.data.totalElements;
        this.cdr.markForCheck();
      });
  }

  viewMore(): void {
    this.more = !this.more;
  }
}
