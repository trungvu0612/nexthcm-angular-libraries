import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { PoliciesService } from '../../policies.service';
import { Policy } from '../../policies';

@Component({
  selector: 'hcm-list-policies',
  templateUrl: './list-policies.component.html',
  styleUrls: ['./list-policies.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPoliciesComponent implements OnInit {

  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  readonly columns = ['topic', 'shortDescription', 'createdDate', 'action'];
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);
  searchSubject = new BehaviorSubject<Policy>({});
  searchForm!: FormGroup<Policy>;
  data!: Policy[];

  constructor(private policiesService: PoliciesService,
              private formBuilder: FormBuilder,
              private destroy$: TuiDestroyService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group<Policy>({});
    combineLatest([this.page$, this.perPageSubject, this.searchSubject]).pipe(
      debounceTime(0),
      switchMap(([page, perpage, search]) => {
        return this.policiesService.getPolicies(page - 1, perpage, search);
      }), takeUntil(this.destroy$))
      .subscribe(item => {
        this.data = item.data.items;
        this.totalLength = item.data.totalElements;
        this.cdr.markForCheck();
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
