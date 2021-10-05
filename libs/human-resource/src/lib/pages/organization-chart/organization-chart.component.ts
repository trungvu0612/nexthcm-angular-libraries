import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, Injector, OnInit } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrgChart, SearchOrg } from '../../models/node';
import { HumanResourceService } from '../../services/human-resource.service';

@Component({
  selector: 'hcm-organization-chart',
  templateUrl: './organization-chart.component.html',
  styleUrls: ['./organization-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState]
})
export class OrganizationChartComponent implements OnInit {

  userId!: string;
  // search!: Observable<string>;

  search!: string;
  readonly search$ = new BehaviorSubject('');

  searchForm = this.fb.group<Partial<SearchOrg>>({});
  model: Partial<SearchOrg> = {};
  data!: (OrgChart[])[];

  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      className: 'w-72',
      type: 'user-combo-box',
      templateOptions: {
        translate: true,
        label: 'Search',
        labelClassName: 'font-semibold',
        placeholder: 'searchUsers',
        labelProp: 'username',
        matcherBy: 'id',
        textfieldLabelOutside: false
      }
    }
  ];

  constructor(
    private readonly authService: AuthService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private humanResourceService: HumanResourceService,
    private destroy$: TuiDestroyService,
    private fb: FormBuilder,
    private translocoService: TranslocoService
  ) {
  }

  ngOnInit(): void {
    this.userId = this.authService.userId();
    const hoverId = this.search ? this.search : this.userId;
    if (hoverId) {
      const idCat = 'cat-' + hoverId;
      let el = document.getElementById(idCat);
      if (el) {
        el.scrollIntoView({ block: 'center' });
      }
    }
  }

  ngAfterViewInit() {
    this.searchForm.valueChanges.pipe(
      map((value) => value.name?.id)
    ).subscribe(
      (data) => {
        data ? this.search$.next(data) : this.search$.next(this.userId);
      });
  }

}
