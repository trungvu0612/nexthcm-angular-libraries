import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LeaveType } from '../../model/leave-type';
import { LeaveTypesService } from '../../leave-types.service';
import { RxState } from '@rx-angular/state';
import { Pagination } from '@nexthcm/core';
import { TranslocoService } from '@ngneat/transloco';
import { BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { PromptComponent } from '@nexthcm/ui';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'hcm-list-leave-type',
  templateUrl: './list-leave-type.component.html',
  styleUrls: ['./list-leave-type.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListLeaveTypeComponent implements OnInit {
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
    fixedColumnWidth: false,
  };
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_LEAVE_TYPES.LEAVE_TYPES_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'createdDate', title: result.createdDate },
        { key: 'operations', title: result.operations },
      ])
    );
  leaveTypes!: LeaveType[];
  private readonly queryParams$ = new BehaviorSubject(new HttpParams().set('page', 0).set('size', 10));
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.leaveTypeService.getLeaveTypes(this.queryParams$.value)),
    map((res) => res.data)
  );

  constructor(
    private leaveTypeService: LeaveTypesService,
    private formBuilder: FormBuilder,
    private state: RxState<Pagination<LeaveType>>,
    private destroy$: TuiDestroyService,
    private translocoService: TranslocoService
  ) {
    state.connect(this.request$);
  }

  ngOnInit(): void {}

  readonly item = (item: LeaveType) => item;

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
    // if (id) {
    //   from(
    //     this.prompt.open({
    //       icon: 'question',
    //       text: this.translocoService.translate('ADMIN_PROCESSES.MESSAGES.deleteProcess'),
    //       showCancelButton: true,
    //     })
    //   )
    //     .pipe(
    //       filter((result) => result.isConfirmed),
    //       switchMap(() =>
    //         this.policiesService.delete(id).pipe(tap(() => this.queryParams$.next(this.queryParams$.value)))
    //       ),
    //       catchError((err) => this.prompt.open({ icon: 'error', text: err.error.message })),
    //       takeUntil(this.destroy$)
    //     )
    //     .subscribe();
    // }
  }
}
