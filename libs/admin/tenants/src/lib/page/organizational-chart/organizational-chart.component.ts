import { ChangeDetectionStrategy, Component, HostListener, Injector, ViewChild } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiDialogService, TuiScrollbarComponent } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { combineLatest, from, iif, merge, Subject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { OrganizationalUnit } from '../../models/tenant';
import { AdminTenantsService } from '../../services/admin-tenants.service';
import { GetSpanChartPipe } from '../../pipes/get-span-chart.pipe';
import { SweetAlertOptions } from 'sweetalert2';
import { UpsertOrganizationUnitComponent } from '../../components/upsert-organization-unit/upsert-organization-unit.component';

interface State {
  levels: string[];
  chart: Partial<OrganizationalUnit>;
  width: number;
  minZoom: number;
  zoom: number;
}

const DIMENSIONS = {
  wrapperPaddingX: 32,
  unitPaddingX: 10,
  unitWith: 250,
  icon: 24,
  bar: 0.5,
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
  hovering: Partial<OrganizationalUnit> | null = null;
  readonly chart$ = this.state.select('chart');
  readonly zoom$ = this.state.select('zoom');
  readonly dimension$ = this.state.select('zoom').pipe(
    map((zoom) => {
      const factor = zoom / 100;
      return {
        wrap: this.state.get('width') * factor + 'px',
        unit: DIMENSIONS.unitWith * factor + 'px',
        icon: DIMENSIONS.icon * factor + 'px',
        bar: DIMENSIONS.bar * factor + 'px',
        one: DIMENSIONS.one * factor + 'px',
        half: (DIMENSIONS.one / 2) * factor + 'px',
      };
    })
  );
  readonly refreshChart$ = new Subject();
  readonly chartRequest$ = this.refreshChart$.pipe(
    startWith(null),
    switchMap(() => this.adminTenantsService.getOrganizationChart()),
    shareReplay(1)
  );
  readonly updateWidth$ = this.chartRequest$.pipe(
    map((chart) => this.getSpanChart.transform(chart) * (DIMENSIONS.unitWith + DIMENSIONS.unitPaddingX * 2)),
    shareReplay(1)
  );
  readonly offsetWidth$ = new Subject<number>();
  readonly resize$ = new Subject<string>();
  readonly updateMinZoom$ = combineLatest([
    this.offsetWidth$.pipe(distinctUntilChanged()),
    this.updateWidth$,
    this.resize$.pipe(distinctUntilChanged()),
  ]).pipe(
    map(([offsetWidth, width]) => (offsetWidth / width <= 1 ? (offsetWidth / width) * 100 : 100)),
    shareReplay(1)
  );
  readonly mousewheel$ = new Subject<{ type: string; payload: number }>();
  readonly updateZoom$ = merge(
    this.updateMinZoom$.pipe(map((payload) => ({ type: 'minZoom', payload }))),
    this.mousewheel$
  );

  constructor(
    private readonly state: RxState<State>,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly getSpanChart: GetSpanChartPipe,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    this.state.set({ zoom: 0 });
    this.state.connect('levels', this.adminTenantsService.getOrganizationalLevels());
    this.state.connect('chart', this.chartRequest$);
    this.state.connect('width', this.updateWidth$);
    this.state.connect('minZoom', this.updateMinZoom$);
    this.state.connect('zoom', this.updateZoom$, ({ zoom, minZoom }, { type, payload }) => {
      switch (type) {
        case 'minZoom':
          return !zoom || zoom < payload ? payload : zoom;
        default:
          if ((zoom < 100 && zoom > minZoom) || (zoom === 100 && payload > 0) || (zoom === minZoom && payload < 0)) {
            const newZoom = zoom - payload / DIMENSIONS.zoomFactor;
            return newZoom > 100 ? 100 : newZoom < minZoom ? minZoom : newZoom;
          }
          return zoom;
      }
    });
  }

  @ViewChild('scrollbar') set scrollbar(scrollbar: TuiScrollbarComponent) {
    if (scrollbar) {
      this.offsetWidth$.next(scrollbar.browserScrollRef.nativeElement.offsetWidth - DIMENSIONS.wrapperPaddingX * 2);
      this.resize$.next('scrollbar');
    }
  }

  @HostListener('window:resize', ['$event']) resize() {
    this.resize$.next('resize');
  }

  @HostListener('mousewheel', ['$event']) zoom(event: WheelEvent) {
    if (this.canZoom) {
      event.preventDefault();
      this.mousewheel$.next({ type: 'mousewheel', payload: event.deltaY });
    }
  }

  item = (item: Partial<OrganizationalUnit>) => item;

  upsertUnit(unit?: Partial<OrganizationalUnit>) {
    this.dialogService
      .open(new PolymorpheusComponent(UpsertOrganizationUnitComponent, this.injector), {
        label: this.translocoService.translate(unit ? 'editOrganizationalUnit' : 'addOrganizationalUnit'),
        data: { unit: unit || {}, levels: this.state.get('levels') },
      })
      .subscribe(() => this.refreshChart$.next());
  }

  deleteUnit(id: string) {
    this.state.hold(
      from(this.promptService.open({ icon: 'warning', showCancelButton: true } as SweetAlertOptions)).pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.adminTenantsService.deleteOrganizationUnit(id))),
        switchMap(() => this.promptService.open({ icon: 'success' } as SweetAlertOptions))
      ),
      () => this.refreshChart$.next()
    );
  }
}
