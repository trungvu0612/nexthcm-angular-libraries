import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Policy } from '../../policies';
import { PoliciesService } from '../../policies.service';
import { PromptComponent } from '@nexthcm/ui';
import { TranslocoService } from '@ngneat/transloco';
import { BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { HttpParams } from '@angular/common/http';
import { RxState } from '@rx-angular/state';
import { Pagination } from '@nexthcm/core';

@Component({
  selector: 'hcm-list-policies',
  templateUrl: './list-policies.component.html',
  styleUrls: ['./list-policies.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPoliciesComponent implements OnInit {
  @ViewChild('table') table!: BaseComponent;
  @ViewChild('prompt') prompt!: PromptComponent;
  readonly loading$ = this.state.$.pipe(map((value) => !value));
  readonly data$ = this.state.select('items');
  readonly total$ = this.state.select('totalElements');
  configuration: Config = {
    ...DefaultConfig,
    checkboxes: false,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false
  };
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_POLICIES.POLICIES_MANAGEMENT_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'topic', title: result.topic },
        { key: 'shortDescription', title: result.shortDescription },
        { key: 'createdDate', title: result.createdDate },
        { key: 'operations', title: result.operations }
      ])
    );
  private readonly queryParams$ = new BehaviorSubject(new HttpParams().set('page', 0).set('size', 10));
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.policiesService.getPolicies(this.queryParams$.value)),
    map((res) => res.data)
  );


  constructor(
    private policiesService: PoliciesService,
    private formBuilder: FormBuilder,
    private state: RxState<Pagination<Policy>>,
    private destroy$: TuiDestroyService,
    private translocoService: TranslocoService,
    private cdr: ChangeDetectorRef
  ) {
    state.connect(this.request$);
  }

  ngOnInit(): void {
  }

  readonly getOne = (item: Policy) => item;

  tableEventEmitted(tableEvent: { event: string; value: any }): void {
    if (tableEvent.event === 'onOrder') {
      this.queryParams$.next(this.queryParams$.value.set('sort', `${tableEvent.value.key},${tableEvent.value.order}`));
    }
  }

  onSize(size: number): void {
    this.queryParams$.next(this.queryParams$.value.set('size', size.toString()));
  }

  onPage(page: number): void {
    this.queryParams$.next(this.queryParams$.value.set('page', page.toString()));
  }

  delete(id: string) {
    if (id) {
      from(
        this.prompt.open({
          icon: 'question',
          text: this.translocoService.translate('ADMIN_PROCESSES.MESSAGES.deleteProcess'),
          showCancelButton: true
        })
      )
        .pipe(
          filter((result) => result.isConfirmed),
          switchMap(() =>
            this.policiesService.delete(id).pipe(tap(() => this.queryParams$.next(this.queryParams$.value)))
          ),
          catchError((err) => this.prompt.open({ icon: 'error', text: err.error.message })),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }
}

