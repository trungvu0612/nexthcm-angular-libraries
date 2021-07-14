import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ValidationService } from '@nexthcm/ui';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Subscriber, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrganizationalUnit } from '../../models/tenant';

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
  @ViewChild('scrollbar') scrollbar!: ElementRef;
  isAdd!: boolean;
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
        bar: 0.5 * factor + 'px',
      };
    })
  );
  readonly form = new FormGroup<Partial<OrganizationalUnit>>({});
  model: Partial<OrganizationalUnit> = {};
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'name',
        textfieldLabelOutside: true,
      },
      ...this.validationService.getValidation(['required']),
    },
    {
      key: 'organizationalLevel',
      type: 'select',
      templateOptions: {
        required: true,
        translate: true,
        label: 'organizationalLevel',
        options: [
          { value: 'Ban Vien', label: 'Ban Vien' },
          { value: 'Team', label: 'Team' },
          { value: 'Section', label: 'Section' },
        ],
      },
    },
    {
      key: 'parentOrganization',
      type: 'select',
      templateOptions: {
        required: true,
        translate: true,
        label: 'parentOrganization',
        options: [
          { value: 'Ban Vien', label: 'Ban Vien' },
          { value: 'Team', label: 'Team' },
          { value: 'Section', label: 'Section' },
        ],
      },
    },
    {
      key: 'manager',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'manager',
        options: [
          { value: 'Ban Vien', label: 'Ban Vien' },
          { value: 'Team', label: 'Team' },
          { value: 'Section', label: 'Section' },
        ],
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
    private readonly validationService: ValidationService,
    private readonly dialogService: TuiDialogService,
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
    if (unit) {
      this.isAdd = false;
      Object.assign(this.model, unit);
    } else this.isAdd = true;
    this.dialogService.open(content).subscribe();
  }

  save(observer: Subscriber<unknown>) {
    observer.complete();
  }

  editUnit(unit: Unit) {
    console.log(unit);
  }

  deleteUnit(unit: Unit) {
    console.log(unit);
  }
}
