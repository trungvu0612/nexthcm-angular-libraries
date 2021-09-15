import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { OrgChart, SearchOrg } from '../../models/node';
import { HumanResourceService } from '../../services/human-resource.service';

@Component({
  selector: 'hcm-organization-chart',
  templateUrl: './organization-chart.component.html',
  styleUrls: ['./organization-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class OrganizationChartComponent implements OnInit {
  @ViewChild('userContent', { static: true }) userContent!: PolymorpheusTemplate<OrgChart>;
  readonly userContext!: { $implicit: OrgChart };

  search!: string;
  data!: OrgChart[];

  searchForm = this.fb.group<Partial<SearchOrg>>({});
  model: Partial<SearchOrg> = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      className: 'w-72',
      type: 'user-combo-box',
      templateOptions: {
        translate: true,
        label: 'Search',
        labelClassName: 'font-semibold',
        placeholder: 'chooseAPerson',
        labelProp: 'username',
        matcherBy: 'id',
        textfieldLabelOutside: false,
      },
    },
    // {
    //   className: 'mt-4',
    //   key: 'name',
    //   type: 'combo-box',
    //   templateOptions: {
    //     labelClassName: 'font-semibold',
    //     placeholder: 'Send to',
    //     label: 'Send to',
    //     textfieldLabelOutside: true,
    //     customContent: this.userContent,
    //     serverRequest: (searchQuery: string) => this.humanResourceService.searchOrg({filter: searchQuery}),
    //     labelProp: 'username',
    //     matcherBy: 'id',
    //   },
    // },
  ];

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private humanResourceService: HumanResourceService,
    private destroy$: TuiDestroyService,
    private fb: FormBuilder,
    private translocoService: TranslocoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.searchForm) {
      console.log('2');
      const search = this.searchForm.controls.name;
      if (search) {
        search.valueChanges.subscribe((data) => {
          this.humanResourceService.getOrgId(data.id).subscribe((value) => (this.data = value));
        });
      }
    }
  }

  // onSearch(search: SearchLevel): void {
  //   this.searchSubject.next(search);
  // }
  onCancel(): void {}

  onSubmit(): void {
    console.log('submitttt', this.data);
  }
}
