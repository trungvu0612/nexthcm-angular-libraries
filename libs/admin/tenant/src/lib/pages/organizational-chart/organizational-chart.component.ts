import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { PromptComponent, ValidationService } from '@nexthcm/ui';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { from, iif, of, Subscriber, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { OrganizationalUnit, OrganizationalUnitForm } from '../../models/tenant';
import { AdminTenantService } from '../../services/admin-tenant.service';
import { TranslocoService } from '@ngneat/transloco';
import { DefaultConfig } from 'ngx-easy-table';
import { SweetAlertOptions } from 'sweetalert2';

interface Unit {
  level: string;
  children?: Unit[];
}

@Component({
  selector: 'hcm-organizational-chart',
  templateUrl: './organizational-chart.component.html',
  styleUrls: ['./organizational-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class OrganizationalChartComponent implements AfterViewInit {
  @ViewChild('prompt') prompt!: PromptComponent;
  @ViewChild('scrollbar') scrollbar!: ElementRef;
  canZoom = false;
  zoom$ = this.state.select('zoom');
  hovering: Unit | null = null;
  root: Unit = {
    level: 'root',
    children: [
      {
        level: '1l',
        children: [
          { level: '2l', children: [{ level: '3', children: [{ level: '4' }] }] },
          { level: '2r', children: [{ level: '3', children: [{ level: '4' }] }] },
        ],
      },
      {
        level: '1l',
        children: [
          { level: '2l', children: [{ level: '3', children: [{ level: '4' }] }] },
          { level: '2r', children: [{ level: '3', children: [{ level: '4' }] }] },
        ],
      },
      {
        level: '1r',
        children: [
          { level: '2l', children: [{ level: '3', children: [{ level: '4' }] }] },
          { level: '2r', children: [{ level: '3', children: [{ level: '4' }] }] },
        ],
      },
    ],
  };
  dimension$ = this.state.select('zoom').pipe(
    map((zoom) => {
      const factor = zoom / 100;
      return {
        wrap: this.getSpread(this.root) * 320 * factor + 64 + 'px',
        unit: 300 * factor + 'px',
        image: 64 * factor + 'px',
        icon: 24 * factor + 'px',
        one: 16 * factor + 'px',
        'three-quarter': 12 * factor + 'px',
        half: 8 * factor + 'px',
        quarter: 4 * factor + 'px',
        bar: 0.5 * factor + 'px',
      };
    })
  );
  readonly configuration = { ...DefaultConfig, orderEnabled: false, paginationEnabled: false };
  readonly columns$ = this.translocoService.selectTranslateObject('TABLE_HEADER').pipe(
    map((translate) => [
      { key: 'name', title: translate.name },
      { key: 'organizationalLevel', title: translate.organizationalLevel },
      { key: 'companyName', title: translate.companyName },
      { key: 'action', title: translate.action },
    ])
  );
  readonly organization$ = this.adminTenantService.select('organization');
  readonly form = new FormGroup<Partial<OrganizationalUnitForm>>({});
  model: Partial<OrganizationalUnitForm> = {};
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'orgName',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'name',
        placeholder: 'enterName',
        textfieldLabelOutside: true,
      },
      ...this.validationService.getValidation(['required']),
    },
    {
      key: 'orgType',
      type: 'select',
      templateOptions: {
        required: true,
        translate: true,
        label: 'organizationalLevel',
        placeholder: 'chooseOrganizationalLevel',
        stringItem: true,
        options: this.adminTenantService.select('levels'),
      },
    },
    {
      key: 'ancestor.id',
      type: 'select',
      templateOptions: {
        required: true,
        translate: true,
        label: 'parentLevel',
        placeholder: 'chooseParentLevel',
        labelProp: 'orgName',
        subLabelProp: 'orgType',
        valueProp: 'id',
      },
      expressionProperties: {
        'templateOptions.disabled': '!model.orgType',
      },
      hooks: {
        onInit: (field?: FormlyFieldConfig) => {
          if (field?.templateOptions) {
            field.templateOptions.options = this.form.controls.orgType?.valueChanges.pipe(
              switchMap((orgType) => (orgType ? this.adminTenantService.getParentLevel(orgType) : of([])))
            );
          }
        },
      },
    },
    {
      key: 'user.id',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'manager',
        placeholder: 'chooseManager',
        labelProp: 'username',
        valueProp: 'id',
        textfieldCleaner: true,
        options: this.adminTenantService.select('users'),
      },
    },
    {
      key: 'description',
      type: 'text-area',
      templateOptions: {
        translate: true,
        label: 'description',
        textfieldLabelOutside: true,
      },
    },
  ];

  constructor(
    private readonly adminTenantService: AdminTenantService,
    private readonly validationService: ValidationService,
    private readonly dialogService: TuiDialogService,
    private readonly translocoService: TranslocoService,
    private readonly state: RxState<{ min: number; zoom: number }>
  ) {
    this.state.set({ min: 100, zoom: 100 });
  }

  get min(): number {
    return this.scrollbar
      ? ((this.scrollbar.nativeElement.offsetWidth - 64) / (this.getSpread(this.root) * 320)) * 100
      : 100;
  }

  @HostListener('window:resize', ['$event'])
  updateMin() {
    this.state.set((state) => {
      if (state.zoom < this.min) return { min: this.min, zoom: this.min };
      return { min: this.min };
    });
  }

  @HostListener('mousewheel', ['$event'])
  zoom(event: WheelEvent) {
    if (this.canZoom) {
      const state = this.state.get();
      if (
        (state.zoom < 100 && state.zoom > state.min) ||
        (state.zoom === 100 && event.deltaY < 0) ||
        (state.zoom === state.min && event.deltaY > 0)
      ) {
        event.preventDefault();
        this.state.set((state) => {
          const newZoom = state.zoom + event.deltaY / 25;
          return { zoom: newZoom > 100 ? 100 : newZoom < state.min ? state.min : newZoom };
        });
      }
    }
  }

  ngAfterViewInit(): void {
    this.state.connect(timer(100).pipe(map(() => ({ min: this.min }))));
  }

  getSpread(item: Unit): number {
    if (item.children?.length)
      return item.children.map((i) => this.getSpread(i)).reduce((a: number, b: number) => a + b);
    else return 1;
  }

  showDialog(content: PolymorpheusContent<TuiDialogContext>, unit?: Partial<OrganizationalUnit>) {
    this.model = unit || {};
    this.dialogService.open(content, { dismissible: false }).subscribe();
  }

  save(observer: Subscriber<unknown>) {
    this.adminTenantService
      .postOrganizationUnit(this.model)
      .pipe(switchMap(() => this.prompt.open({ icon: 'success' } as SweetAlertOptions)))
      .subscribe(() => observer.complete());
  }

  delete(id: string) {
    from(this.prompt.open({ icon: 'warning', showCancelButton: true } as SweetAlertOptions))
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.adminTenantService.deleteOrganizationUnit(id))),
        switchMap(() => this.prompt.open({ icon: 'success' } as SweetAlertOptions))
      )
      .subscribe();
  }
}
