import { Directive } from '@angular/core';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Directive()
export abstract class AbstractTransitionOptionListComponent<T> {
  data!: T[];

  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
  };
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('WORKFLOW_TRANSITION_OPTION_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'functions', title: result.functions },
      ])
    );

  protected constructor(readonly translocoService: TranslocoService) {}

  setTableRowsAmount(): void {
    this.configuration.rows = this.data?.length || 0;
    this.configuration = { ...this.configuration };
  }
}
