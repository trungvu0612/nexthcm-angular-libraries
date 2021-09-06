import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { BaseUser, PromptService, UserDto } from '@nexthcm/cdk';
import { FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { from, iif, of, Subscriber } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { OrganizationalUnit, OrganizationalUnitForm } from '../../models/tenant';
import { AdminTenantService } from '../../services/admin-tenant.service';
import { TuiDestroyService } from '@taiga-ui/cdk';

interface State {
  users: Partial<UserDto>[];
  levels: string[];
  chart: Partial<OrganizationalUnit>;
  width: number;
  min: number;
  zoom: number;
}

@Component({
  selector: 'hcm-organizational-chart',
  templateUrl: './organizational-chart.component.html',
  styleUrls: ['./organizational-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService]
})
export class OrganizationalChartComponent implements OnInit {
  @ViewChild('userContent', { static: true }) userContent!: PolymorpheusTemplate<OrganizationalUnitForm>;
  readonly userContext!: { $implicit: BaseUser };
  @ViewChild('scrollbar') scrollbar!: ElementRef;
  canZoom = false;
  hovering: OrganizationalUnit | null = null;
  chart$ = this.state.select('chart');
  zoom$ = this.state.select('zoom');
  dimension$ = this.state.select('zoom').pipe(
    map((zoom) => {
      const factor = zoom / 100;
      return {
        wrap: this.state.get('width') * factor + 'px',
        unit: 300 * factor + 'px',
        image: 64 * factor + 'px',
        icon: 24 * factor + 'px',
        one: 16 * factor + 'px',
        'three-quarter': 12 * factor + 'px',
        half: 8 * factor + 'px',
        quarter: 4 * factor + 'px',
        bar: 0.5 * factor + 'px'
      };
    })
  );
  readonly form = new FormGroup<Partial<OrganizationalUnitForm>>({});
  model!: Partial<OrganizationalUnitForm>;
  fields!: FormlyFieldConfig[];

  constructor(
    private readonly adminTenantService: AdminTenantService,
    private readonly dialogService: TuiDialogService,
    private readonly translocoService: TranslocoService,
    private readonly state: RxState<State>,
    private promptService: PromptService
  ) {
    this.state.connect('users', this.adminTenantService.getUsers());
    this.state.connect('levels', this.adminTenantService.getOrganizationalLevels());
    this.state.connect('chart', this.adminTenantService.getOrganizationChart());
    this.state.hold(this.state.select('chart'), (chart) => {
      this.state.set({ width: this.getSpan(chart) * 320 });
    });
    this.state.hold(this.state.select('width'), () => {
      const min = this.min > 100 ? 100 : this.min;
      this.state.set({ min, zoom: min });
    });
  }

  get min(): number {
    return this.scrollbar && this.state.get('width')
      ? ((this.scrollbar.nativeElement.offsetWidth - 64) / this.state.get('width')) * 100
      : 0;
  }

  @HostListener('window:resize', ['$event'])
  updateMin() {
    if (this.min <= 100)
      this.state.set((state) => {
        if (state.zoom < this.min) return { min: this.min, zoom: this.min };
        return { min: this.min };
      });
  }

  @HostListener('mousewheel', ['$event'])
  zoom(event: WheelEvent) {
    if (this.canZoom) {
      event.preventDefault();
      const state = this.state.get();
      if (
        (state.zoom < 100 && state.zoom > state.min) ||
        (state.zoom === 100 && event.deltaY < 0) ||
        (state.zoom === state.min && event.deltaY > 0)
      ) {
        this.state.set((state) => {
          const newZoom = state.zoom + event.deltaY / 25;
          return { zoom: newZoom > 100 ? 100 : newZoom < state.min ? state.min : newZoom };
        });
      }
    }
  }

  ngOnInit(): void {
    this.fields = [
      {
        key: 'orgName',
        type: 'input',
        templateOptions: {
          required: true,
          translate: true,
          label: 'name',
          placeholder: 'enterName',
          textfieldLabelOutside: true
        }
      },
      {
        key: 'orgType',
        type: 'select',
        templateOptions: {
          required: true,
          translate: true,
          label: 'organizationalLevel',
          placeholder: 'chooseOrganizationalLevel',
          options: this.state.select('levels')
        }
      },
      {
        key: 'ancestor',
        type: 'select',
        templateOptions: {
          required: true,
          translate: true,
          label: 'parentLevel',
          placeholder: 'chooseParentLevel',
          labelProp: 'orgName',
          subLabelProp: 'orgType',
          matcherBy: 'id'
        },
        expressionProperties: { 'templateOptions.disabled': '!model.orgType' },
        hooks: {
          onInit: (field?: FormlyFieldConfig) => {
            if (field?.templateOptions) {
              field.templateOptions.options = this.form.controls.orgType?.valueChanges.pipe(
                switchMap((orgType) => (orgType ? this.adminTenantService.getParentLevel(orgType) : of([])))
              );
            }
          }
        }
      },
      {
        key: 'user',
        type: 'combo-box',
        templateOptions: {
          translate: true,
          labelClassName: 'font-semibold',
          placeholder: 'Choose manager',
          label: 'Manager',
          textfieldLabelOutside: true,
          customContent: this.userContent,
          serverRequest: (searchQuery: string) => this.adminTenantService.searchUsers(searchQuery),
          labelProp: 'name',
          matcherBy: 'id'
        },
      },
      {
        key: 'description',
        type: 'text-area',
        templateOptions: {
          translate: true,
          label: 'description',
          textfieldLabelOutside: true
        }
      }
    ];
  }

  getSpan(item: Partial<OrganizationalUnit>): number {
    if (item.descendants?.length)
      return item.descendants.map((i) => this.getSpan(i)).reduce((a: number, b: number) => a + b);
    else return 1;
  }

  upsertUnit(content: PolymorpheusContent<TuiDialogContext>, id?: string) {
    if (id) {
      this.adminTenantService.getOrgDetail(id).subscribe((result) => {
        if (result) {
          this.model = result || {};
        }
      });
    } else {
      this.model = {};
    }
    this.dialogService
      .open(content, {
        label: this.translocoService.translate(id ? 'editOrganizationalUnit' : 'addOrganizationalUnit')
      })
      .subscribe();
  }

  submitUnit(observer: Subscriber<unknown>) {
    if (this.form.valid) {
      const formModel = this.form.value;
      const jsonSubmit = {
        orgName: formModel.orgName,
        orgType: formModel.orgType,
        ancestor: { id: formModel?.ancestor?.id },
        description: formModel.description
      } as any;

      if (this.model?.id) {
        jsonSubmit.user.id = formModel?.user?.id;
        jsonSubmit.id = formModel.id;
      }

      this.form.markAsUntouched();
      this.adminTenantService[this.model?.id ? 'editOrganizationUnit' : 'createOrganizationUnit'](jsonSubmit)
        .pipe(switchMap(() => this.promptService.open({ icon: 'success' } as SweetAlertOptions)))
        .subscribe(() => this.state.connect('chart', this.adminTenantService.getOrganizationChart()));
      observer.complete();
    }
  }

  deleteUnit(id: string) {
    from(this.promptService.open({ icon: 'warning', showCancelButton: true } as SweetAlertOptions))
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.adminTenantService.deleteOrganizationUnit(id))),
        switchMap(() => this.promptService.open({ icon: 'success' } as SweetAlertOptions))
      )
      .subscribe(() => this.state.connect('chart', this.adminTenantService.getOrganizationChart()));
  }
}
