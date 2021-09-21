import { AfterViewInit, ChangeDetectorRef, Directive, EventEmitter, Inject } from '@angular/core';
import { HashMap, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { ProviderScope, TranslocoScope } from '@ngneat/transloco/lib/types';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Directive()
export abstract class AbstractTransitionOptionListComponent<T> implements AfterViewInit {
  abstract table: APIDefinition;
  abstract data: T[];
  abstract dataChange: EventEmitter<T[]>;

  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
  };
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('TRANSITION_OPTION_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'functions', title: result.functions },
      ])
    );

  protected constructor(
    readonly translocoService: TranslocoService,
    readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(TRANSLOCO_SCOPE) readonly scope: TranslocoScope
  ) {}

  readonly item = (item: T) => item;

  abstract openAddOptionToTransitionDialog(item?: T): Observable<T>;

  ngAfterViewInit(): void {
    this.table?.apiEvent({ type: API.setPaginationDisplayLimit, value: this.data.length });
  }

  onAddOption(): void {
    this.openAddOptionToTransitionDialog().subscribe((option) => {
      this.data = [...this.data, option];
      this.dataChange.emit(this.data);
      this.table.apiEvent({ type: API.setPaginationDisplayLimit, value: this.data.length });
      this.changeDetectorRef.markForCheck();
    });
  }

  onEditOption(index: number): void {
    this.openAddOptionToTransitionDialog(this.data[index]).subscribe((option) => {
      this.data.splice(index, 1, option);
      this.data = [...this.data];
      this.dataChange.emit(this.data);
      this.changeDetectorRef.markForCheck();
    });
  }

  onRemoveOption(index: number): void {
    this.data.splice(index, 1);
    this.data = [...this.data];
    this.dataChange.emit(this.data);
    this.changeDetectorRef.markForCheck();
  }
}
