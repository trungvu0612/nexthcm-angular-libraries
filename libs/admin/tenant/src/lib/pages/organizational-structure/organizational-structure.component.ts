import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { Subscriber } from 'rxjs';
import { ValidationService } from '@nexthcm/ui';
import { OrganizationalLevel } from '../../models/tenant';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Columns, DefaultConfig } from 'ngx-easy-table';
import { RxState } from '@rx-angular/state';
import { TranslocoService } from '@ngneat/transloco';
import { map } from 'rxjs/operators';

@Component({
  selector: 'hcm-organizational-structure',
  templateUrl: './organizational-structure.component.html',
  styleUrls: ['./organizational-structure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class OrganizationalStructureComponent {
  isAdd!: boolean;
  readonly configuration = { ...DefaultConfig, orderEnabled: false, paginationEnabled: false };
  columns$ = this.state.select('columns');
  data = [
    { name: 'Department', parentOrganization: 'Ban Vien' },
    { name: 'Team', parentOrganization: 'Department' },
    { name: 'Section', parentOrganization: 'Team' },
  ];
  readonly form = new FormGroup<Partial<OrganizationalLevel>>({});
  model: Partial<OrganizationalLevel> = {};
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
      key: 'parentLevel',
      type: 'select',
      templateOptions: {
        required: true,
        translate: true,
        label: 'parentLevel',
        options: [
          { value: 'Ban Vien', label: 'Ban Vien' },
          { value: 'Team', label: 'Team' },
          { value: 'Section', label: 'Section' },
        ],
      },
    },
  ];

  constructor(
    private readonly validationService: ValidationService,
    private readonly dialogService: TuiDialogService,
    private readonly translocoService: TranslocoService,
    private readonly state: RxState<{ columns: Columns[] }>
  ) {
    this.state.connect(
      'columns',
      this.translocoService.selectTranslateObject('TABLE_HEADER').pipe(
        map((translate) => [
          { key: 'name', title: translate.name, width: '40%' },
          { key: 'parentOrganization', title: translate.parentOrganization, width: '40%' },
          { key: 'action', title: translate.action, width: '20%' },
        ])
      )
    );
  }

  showDialog(content: PolymorpheusContent<TuiDialogContext>, level?: Partial<OrganizationalLevel>) {
    if (level) {
      this.isAdd = false;
      Object.assign(this.model, level);
    } else this.isAdd = true;
    this.dialogService.open(content).subscribe();
  }

  save(observer: Subscriber<unknown>) {
    observer.complete();
  }
}
