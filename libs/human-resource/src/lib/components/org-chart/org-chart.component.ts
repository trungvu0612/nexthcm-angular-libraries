import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { map } from 'rxjs/operators';
import { OrgChart } from '../../models/node';
import { HumanResourceService } from '../../services/human-resource.service';
import { NodeChartComponent } from '../node-chart/node-chart.component';

interface State {
  orgChart: OrgChart[];
}

@Component({
  selector: 'hcm-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class OrgChartComponent extends RxState<State> implements OnInit {
  title = 'main component';

  @Input() search!: string;
  @Input() data!: OrgChart[];

  // @Input() set search(search$: Observable<string>) {
  //   search$.pipe(map((search) => ({ longDescription: search, size: 0 }))).subscribe(this.params$);
  // }

  // search$.pipe(map((search) => console.log('aaaaaa', this.humanResourceService.getOrgId(search))));

  @ViewChild('placeholder', { read: ViewContainerRef, static: true })
  public placeholder!: ViewContainerRef;
  public NodeChartComponent = NodeChartComponent;
  public customInJector!: Injector;

  @ViewChild('userContent', { static: true }) orgContent!: PolymorpheusTemplate<OrgChart>;
  orgContext!: { $implicit: OrgChart };
  @ViewChild('scrollbar') scrollbar!: ElementRef;

  isHover?: boolean = false;
  data$ = this.select('orgChart').pipe(map((data) => [data]));

  open = true;

  idLeader?: string = '';
  idEmployee = '';

  constructor(
    private fb: FormBuilder,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private humanResourceService: HumanResourceService,
    private destroy$: TuiDestroyService,
    private translocoService: TranslocoService
  ) {
    super();
    this.connect('orgChart', humanResourceService.getOrg());

    this.customInJector = Injector.create({
      providers: [
        {
          provide: HumanResourceService,
          deps: [],
        },
      ],
      parent: this.injector,
    });

    console.log('22222', this.data)
  }

  ngOnInit(): void {
    const humanResourceService = this.customInJector.get(HumanResourceService);
    humanResourceService.hovered.subscribe((item) => {});
  }

  ngAfterViewInit() {
    // this.search.subscribe((data) => this.humanResourceService.getOrgId(data));
  }

  changeInfoCss(id: string): void {
    if (id == this.idLeader) {
      this.idLeader == '';
    } else {
      this.idLeader = id;
      this.data$;
    }
  }

  changeInfo(id: string): void {
    if (id == this.idLeader) {
      this.idLeader == '';
    } else {
      this.idEmployee = id;
      this.idLeader = id;
    }
  }

  clickEvent(item: OrgChart): OrgChart {
    return (this.customInJector.get(HumanResourceService).description = item);
  }
}
