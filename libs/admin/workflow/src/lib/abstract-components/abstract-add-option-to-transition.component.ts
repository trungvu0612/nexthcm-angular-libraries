import { OnInit } from '@angular/core';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export abstract class AbstractAddOptionToTransitionComponent<T> implements OnInit {
  table!: APIDefinition;
  data!: T[];

  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
    checkboxes: true,
  };
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('WORKFLOW_TRANSITION_OPTION_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
      ])
    );

  protected constructor(readonly translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.setTableRowsAmount();
  }

  private setTableRowsAmount(): void {
    this.table.apiEvent({
      type: API.setPaginationDisplayLimit,
      value: this.data.length,
    });
  }
}
