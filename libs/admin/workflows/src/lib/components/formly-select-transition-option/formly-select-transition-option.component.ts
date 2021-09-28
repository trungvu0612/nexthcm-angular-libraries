import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HashMap, ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { FieldType } from '@ngx-formly/core';
import { isPresent, TuiDestroyService, TuiIdentityMatcher } from '@taiga-ui/cdk';
import { APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { TransitionOption } from '../../models';

@Component({
  selector: 'hcm-formly-select-transition-option',
  templateUrl: './formly-select-transition-option.component.html',
  styleUrls: ['./formly-select-transition-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class FormlySelectTransitionOptionComponent extends FieldType implements OnInit {
  @ViewChild('table', { static: true }) table!: APIDefinition;

  data: any[] = [];
  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
    orderEnabled: false,
  };
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('TRANSITION_OPTION_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: '', title: '' },
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
      ])
    );

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly destroy$: TuiDestroyService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope
  ) {
    super();
  }

  readonly item = (item: TransitionOption<any>) => item;
  readonly identityMatcher: TuiIdentityMatcher<TransitionOption<any>> = (item1, item2) => item1.id === item2.id;

  ngOnInit(): void {
    (this.to.options as Observable<TransitionOption<any>[]>)
      .pipe(filter(isPresent), takeUntil(this.destroy$))
      .subscribe((res) => {
        this.data = res;
        this.configuration.rows = this.data.length;
        this.configuration = { ...this.configuration };
        this.changeDetectorRef.markForCheck();
      });
  }
}
