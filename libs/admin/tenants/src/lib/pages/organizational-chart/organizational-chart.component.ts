import { ChangeDetectionStrategy, Component, HostListener, Injector, ViewChild } from '@angular/core';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { Organization, OrganizationsService, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiDialogService, TuiScrollbarComponent } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { combineLatest, from, iif, merge, of, Subject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { UpsertOrganizationalUnitComponent } from '../../components/upsert-organization-unit/upsert-organizational-unit.component';
import { GetSpanChartPipe } from '../../pipes/get-span-chart.pipe';
import { AdminTenantsService } from '../../services/admin-tenants.service';

interface State {
  levels: string[];
  chart: Organization;
  width: number;
  minZoom: number;
  zoom: number;
}

const DIMENSIONS = {
  wrapperPaddingX: 32,
  unitPaddingX: 10,
  unitWith: 200,
  bar: 0.5,
  text: 14,
  one: 16,
  zoomFactor: 25,
};

@Component({
  selector: 'hcm-organizational-chart',
  templateUrl: './organizational-chart.component.html',
  styleUrls: ['./organizational-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GetSpanChartPipe, RxState],
})
export class OrganizationalChartComponent {
  canZoom = false;
  readonly chart$ = this.state.select('chart');
  readonly zoom$ = this.state.select('zoom');
  readonly dimension$ = this.state.select('zoom').pipe(
    map((zoom) => {
      const factor = zoom / 100;
      return {
        wrap: this.state.get('width') * factor + 'px',
        unit: DIMENSIONS.unitWith * factor + 'px',
        bar: DIMENSIONS.bar * factor + 'px',
        text: DIMENSIONS.text * factor + 'px',
        one: DIMENSIONS.one * factor + 'px',
      };
    })
  );
  readonly refreshChart$ = new Subject();
  readonly chartRequest$ = this.refreshChart$.pipe(
    startWith(null),
    switchMap(() => this.organizationsService.getOrganizationStructure(this.routerQuery.getParams('tenantId') || '')),
    shareReplay(1)
  );
  readonly updateWidth$ = this.chartRequest$.pipe(
    map((chart) => this.getSpanChart.transform(chart) * (DIMENSIONS.unitWith + DIMENSIONS.unitPaddingX * 2)),
    shareReplay(1)
  );
  readonly scrollbar$ = new Subject<TuiScrollbarComponent>();
  readonly resize$ = new Subject<string>();
  readonly updateMinZoom$ = combineLatest([
    this.scrollbar$.pipe(distinctUntilChanged()),
    this.updateWidth$.pipe(distinctUntilChanged()),
    this.resize$.pipe(distinctUntilChanged((prev, curr) => prev === curr && curr === 'scrollbar')),
  ]).pipe(
    map(([scrollbar, width]) => {
      const offsetWidth = scrollbar.browserScrollRef.nativeElement.offsetWidth - DIMENSIONS.wrapperPaddingX * 2;
      return offsetWidth / width <= 1 ? (offsetWidth / width) * 100 : 100;
    }),
    shareReplay(1)
  );
  readonly mousewheel$ = new Subject<{ type: string; payload: number }>();
  readonly updateZoom$ = merge(
    this.updateMinZoom$.pipe(map((payload) => ({ type: 'minZoom', payload }))),
    this.mousewheel$
  );
  readonly removeUnit$ = new Subject<string>();

  constructor(
    private readonly state: RxState<State>,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly organizationsService: OrganizationsService,
    private readonly getSpanChart: GetSpanChartPipe,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService,
    private readonly routerQuery: RouterQuery
  ) {
    this.state.set({ zoom: 0 });
    this.state.connect('levels', this.adminTenantsService.getOrganizationalLevels());
    this.state.connect('chart', this.chartRequest$);
    this.state.connect('width', this.updateWidth$);
    this.state.connect('minZoom', this.updateMinZoom$);
    this.state.connect('zoom', this.updateZoom$, ({ zoom, minZoom }, { type, payload }) => {
      if (type === 'minZoom') {
        return !zoom || zoom < payload ? payload : zoom;
      } else {
        if ((zoom < 100 && zoom > minZoom) || (zoom === 100 && payload > 0) || (zoom === minZoom && payload < 0)) {
          const newZoom = zoom - payload / DIMENSIONS.zoomFactor;
          return newZoom > 100 ? 100 : newZoom < minZoom ? minZoom : newZoom;
        }
        return zoom;
      }
    });
    this.state.hold(
      this.removeUnit$.pipe(
        switchMap((id) =>
          from(
            this.promptService.open({
              icon: 'warning',
              showCancelButton: true,
            } as SweetAlertOptions)
          ).pipe(
            switchMap((result) => iif(() => result.isConfirmed, this.adminTenantsService.deleteOrganizationalUnit(id))),
            tap(() => this.refreshChart$.next())
          )
        )
      )
    );
  }

  @ViewChild('scrollbar') set scrollbar(scrollbar: TuiScrollbarComponent) {
    if (scrollbar) {
      this.scrollbar$.next(scrollbar);
      this.resize$.next('scrollbar');
    }
  }

  @HostListener('window:resize', ['$event']) resize(): void {
    this.resize$.next('resize');
  }

  @HostListener('mousewheel', ['$event']) zoom(event: WheelEvent) {
    if (this.canZoom) {
      event.preventDefault();
      this.mousewheel$.next({ type: 'mousewheel', payload: event.deltaY });
    }
  }

  readonly item = (item: Organization) => item;

  upsertUnit(orgId?: string): void {
    (orgId ? this.adminTenantsService.getOrganizationalUnit(orgId) : of({}))
      .pipe(
        switchMap((unit) =>
          this.dialogService.open(new PolymorpheusComponent(UpsertOrganizationalUnitComponent, this.injector), {
            label: this.translocoService.translate(
              orgId ? 'tenants.editOrganizationalUnit' : 'tenants.addOrganizationalUnit'
            ),
            data: { unit: unit, levels: this.state.get('levels') },
          })
        )
      )

      .subscribe(() => this.refreshChart$.next());
  }

  deleteUnit(id?: string): void {
    if (id) {
      this.removeUnit$.next(id);
    }
  }
}
