import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'hcm-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractListComponent implements OnInit {
  @ViewChild('table') table!: BaseComponent;
  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
  };
  public data$: any[] = [];

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_CONTRACT_MANAGEMENT_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'creator', title: result.creator },
        { key: 'nameType', title: result.nameType },
        { key: 'actions', title: result.functions },
      ])
    );

  constructor(private translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.data$.push(
      {
        creator: 'Nguyen Thanh Son',
        nameType: 'Probation',
      },
      {
        creator: 'Lam Thu Nguyen',
        nameType: 'Labour one year',
      }
    );
  }

  onAddContract() {}
}
