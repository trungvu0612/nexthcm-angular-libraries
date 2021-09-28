import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { OrgChart } from '../../models/node';
import { HumanResourceService } from '../../services/human-resource.service';
import { NodeChartComponent } from '../node-chart/node-chart.component';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Component({
  selector: 'hcm-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class OrgChartComponent implements OnInit, OnChanges {
  title = 'main component';
  readonly params$ = new BehaviorSubject<string>('');

  employee$: Observable<OrgChart[][]> = this.params$.pipe(
    switchMap((params) => this.humanResourceService.getOrg()),
    map((data) => [data])
  );

  @Input() set search1(search$: Observable<string>) {
    search$.subscribe(this.params$);
  }

  readonly loading$ = this.employee$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  @Input() userId!: string;
  @Input() search!: string | undefined;
  @Input() data!: OrgChart[][] | undefined;

  @ViewChild('placeholder', { read: ViewContainerRef, static: true })
  public placeholder!: ViewContainerRef;
  public NodeChartComponent = NodeChartComponent;
  public customInJector!: Injector;

  @ViewChild('userContent', { static: true }) orgContent!: PolymorpheusTemplate<OrgChart>;
  orgContext!: { $implicit: OrgChart };
  @ViewChild('scrollbar') scrollbar!: ElementRef;

  constructor(
    @Inject(ElementRef) private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(TuiDestroyService) private readonly destroy$: TuiDestroyService,
    private fb: FormBuilder,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private humanResourceService: HumanResourceService
  ) {
    this.customInJector = Injector.create({
      providers: [
        {
          provide: HumanResourceService,
          deps: [],
        },
      ],
      parent: this.injector,
    });
  }

  ngOnInit(): void {
    const humanResourceService = this.customInJector.get(HumanResourceService);
    humanResourceService.hovered.subscribe((item) => {});
  }

  ngAfterViewInit() {}

  ngOnChanges() {
    this.params$.subscribe((search) => {
      this.search = search;
      this.userId = '';
      const idCat = 'cat-' + this.search;
      let el = document.getElementById(idCat);
      if (el) {
        el.scrollIntoView({ block: 'center' });
      }
    });
  }

  hoverEvent(item: OrgChart): OrgChart {
    return (this.customInJector.get(HumanResourceService).description = item);
  }

  clickItem(id: string) {
    this.params$.next(id);
    this.employee$ = this.params$.pipe(
      switchMap((params) => this.humanResourceService.getOrgId(params)),
      map((data) => [data])
    );
  }

  checkCurrentItemId(item: OrgChart) {
    return { employee: item.id === this.search || item.id === this.userId };
  }
}
