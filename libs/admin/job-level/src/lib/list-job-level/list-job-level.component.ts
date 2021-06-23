import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Level, SearchLevel } from '../models/level';
import { JobLevelService } from '../job-level.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'hcm-list-job-level',
  templateUrl: './list-job-level.component.html',
  styleUrls: ['./list-job-level.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListJobLevelComponent implements OnInit {
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  readonly columns = ['name', 'description', 'action'];
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);
  searchSubject = new BehaviorSubject<SearchLevel>({});
  searchForm!: FormGroup<SearchLevel>;
  levels: Level[] = [];
  model!: SearchLevel;
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      defaultValue: '',
      templateOptions: {
        textfieldLabelOutside: true,
        placeholder: 'Search By Name'
      }
    }
  ];

  constructor(private jobLevelService: JobLevelService,
              private formBuilder: FormBuilder,
              private destroy$: TuiDestroyService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group<SearchLevel>({});
    combineLatest([this.page$, this.perPageSubject, this.searchSubject]).pipe(
      debounceTime(300),
      switchMap(([page, perpage, search]) => {
        return this.jobLevelService.getLevels(page - 1, perpage, search);
      }), takeUntil(this.destroy$))
      .subscribe(item => {
        this.levels = item.data.items;
        this.totalLength = item.data.totalElements;
        this.cdr.markForCheck();
      });
    this.searchForm.controls.name?.valueChanges.subscribe(value => {
      console.log(value);
      this.onSearch({ name: value });
    });
  }

  onPage(page: number) {
    this.page$.next(page + 1);
  }

  onSize(size: number) {
    this.perPageSubject.next(size);
  }

  onSearch(search: SearchLevel): void {
    this.searchSubject.next(search);
  }
}
