import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, combineLatest, from } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';
import { JobLevelService } from '../job-level.service';
import { Level, SearchLevel } from '../models/level';
import { TranslocoService } from '@ngneat/transloco';
import { AbstractServerPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { BaseComponent } from 'ngx-easy-table';
import { RxState } from '@rx-angular/state';

@Component({
  selector: 'hcm-list-job-level',
  templateUrl: './list-job-level.component.html',
  styleUrls: ['./list-job-level.component.scss'],
  providers: [TuiDestroyService, RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListJobLevelComponent extends AbstractServerPaginationTableComponent<Level> implements OnInit {
  @ViewChild('table') table!: BaseComponent;
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
        placeholder: 'Search By Name',
      },
    },
  ];

  constructor(
    public state: RxState<Pagination<Level>>,
    private jobLevelService: JobLevelService,
    private formBuilder: FormBuilder,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state);
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group<SearchLevel>({});
    combineLatest([this.page$, this.perPageSubject, this.searchSubject])
      .pipe(
        debounceTime(300),
        switchMap(([page, perpage, search]) => {
          return this.jobLevelService.getLevels(page - 1, perpage, search);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        this.levels = item.data.items;
        this.totalLength = item.data.totalElements;
        this.cdr.markForCheck();
      });
    this.searchForm.controls.name?.valueChanges.subscribe((value) => {
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

  onRemoveJobLevel(id: any): void {
    if (id) {
      from(
        this.promptService.open({
          icon: 'question',
          html: this.translocoService.translate('deleteJobLevel'),
          showCancelButton: true,
        })
      )
        .pipe(
          filter((result) => result.isConfirmed),
          switchMap(() => this.jobLevelService.deleteAdminJobLevel(id)),
          takeUntil(this.destroy$)
        )
        .subscribe(
          this.promptService.handleResponse('deleteJobLevelSuccessfully', () =>
            this.queryParams$.next(this.queryParams$.value)
          )
        );
    }
  }
}
