import { HttpParams } from '@angular/common/http';
import { Directive, Injector, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService, WorkflowStatus } from '@nexthcm/cdk';
import { ProviderScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { FileSaverService } from 'ngx-filesaver';
import { BehaviorSubject, EMPTY, from, iif, Observable, Subject } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, tap } from 'rxjs/operators';

import { BulkChangeComponent } from '../components';
import { RequestTypeUrlPaths } from '../models';
import { MyRequestsService, RequestDetailDialogService } from '../services';

@Directive()
export abstract class AbstractRequestListComponent<T>
  extends AbstractServerSortPaginationTableComponent<T>
  implements OnInit
{
  abstract requestTypeUrlPath: keyof RequestTypeUrlPaths;
  abstract myRequestsService: MyRequestsService;
  abstract requestDetailDialogService: RequestDetailDialogService;
  abstract promptService: PromptService;
  abstract translocoService: TranslocoService;
  abstract translocoScope: ProviderScope;
  abstract columns$: Observable<Columns[]>;

  readonly fileSaverService!: FileSaverService;

  readonly dialogService!: TuiDialogService;
  readonly injector!: Injector;
  readonly fb!: FormBuilder;
  selectAllControl!: FormControl;
  selectedArray!: FormArray;

  override sizeItems = [10, 20];

  // EVENTS
  readonly viewRequestDetail$ = new Subject<[string, string | undefined]>();
  readonly changeStatus$ = new Subject<[string, WorkflowStatus]>();

  // HANDLERS
  readonly changeStatusHandler$ = this.changeStatus$.pipe(
    switchMap(([requestId, { id, name }]) =>
      from(
        this.promptService.open({
          icon: 'question',
          html: this.translocoService.translate('changeWorkflowStatus', { name }),
          showCancelButton: true,
        })
      ).pipe(
        switchMap((result) =>
          iif(
            () => result.isConfirmed,
            this.myRequestsService.changeRequestStatus(this.requestTypeUrlPath, requestId, id).pipe(
              tap(
                this.promptService.handleResponse('requestUpdated', () => {
                  this.fetch$.next();
                })
              ),
              startWith(null)
            ),
            EMPTY
          )
        )
      )
    )
  );
  readonly viewRequestDetailHandler$ = this.viewRequestDetail$.pipe(
    switchMap(([requestId, userId]) =>
      this.requestDetailDialogService.viewRequestDetail(this.requestTypeUrlPath, requestId, userId)
    ),
    tap(() => this.setQueryParams('id', null))
  );

  bulkChangeLoading = false;
  readonly bulkChange$ = new BehaviorSubject<TemplateRef<unknown> | null>(null);
  readonly bulkChangeHandler$ = this.bulkChange$.pipe(
    filter((v) => v !== null),
    tap(() => (this.bulkChangeLoading = true)),
    switchMap(() =>
      this.myRequestsService.getStatusTransitions(
        this.requestTypeUrlPath,
        this.state
          .get('items')
          .map(({ id }, index) => this.selectedArray.value[index] && id)
          .filter((v) => v)
          .join(', ')
      )
    ),
    switchMap((data) => {
      setTimeout(() => (this.bulkChangeLoading = false), 100);
      return data.length
        ? this.dialogService
            .open(new PolymorpheusComponent(BulkChangeComponent, this.injector), {
              label: this.translocoService.translate(this.translocoScope.scope + '.bulkChange'),
              size: 'page',
              data: { data, columns$: this.columns$, template: this.bulkChange$.value },
            })
            .pipe(tap(() => this.fetch$.next()))
        : this.promptService.open({
            icon: 'warning',
            text: this.translocoService.translate(this.translocoScope.scope + '.cannotBeTransitioned'),
          });
    })
  );

  readonly export$ = new Subject<void>();
  readonly exportLoading$ = this.export$.pipe(
    switchMap(() =>
      this.myRequestsService.exportRequests(this.requestTypeUrlPath, this.queryParams).pipe(
        tap((blob) => this.fileSaverService.save(blob)),
        catchError((err) =>
          from(this.promptService.open({ icon: 'error', html: this.promptService.generateErrorMessage(err) }))
        ),
        startWith(null)
      )
    ),
    map((value) => !value)
  );

  protected constructor(
    override readonly state: RxState<Pagination>,
    override readonly activatedRoute: ActivatedRoute
  ) {
    super(state, activatedRoute);
    state.hold(this.viewRequestDetailHandler$);
    state.hold(this.bulkChangeHandler$);

    this.configuration.checkboxes = true;
    state.hold(state.select('items'), (items) => {
      if (this.fb) {
        this.selectAllControl = this.fb.control(false);
        this.selectedArray = this.fb.array(items.map(() => false));

        state.hold(this.selectAllControl.valueChanges, (value) => {
          this.selectedArray.setValue(
            this.selectedArray.value.map(() => value),
            { emitEvent: false }
          );
        });

        state.hold(this.selectedArray.valueChanges, (value: boolean[]) => {
          value.every((v) => v)
            ? this.selectAllControl.setValue(true, { emitEvent: false })
            : this.selectAllControl.value && this.selectAllControl.setValue(false, { emitEvent: false });
        });
      }
    });
  }

  get requestId(): string | null {
    return this.activatedRoute.snapshot.queryParamMap.get('id');
  }

  ngOnInit(): void {
    if (this.requestId) {
      this.viewRequestDetail$.next([this.requestId, undefined]);
    }
  }

  onViewEmployeeRequestDetail(id: string, userId?: string): void {
    this.setQueryParams('id', id);
    this.viewRequestDetail$.next([id, userId]);
  }

  onFilter(httpParams: HttpParams): void {
    this.queryParams = httpParams;
    this.fetch$.next();
  }
}
