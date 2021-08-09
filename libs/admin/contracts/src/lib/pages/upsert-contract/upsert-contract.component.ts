import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'hcm-upsert-contract',
  templateUrl: './upsert-contract.component.html',
  styleUrls: ['./upsert-contract.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertContractComponent implements OnInit {
  model: any = {};
  readonly form = new FormGroup({
    name: new FormControl([]),
    status: new FormControl([]),
    workflow: new FormControl([]),
    description: new FormControl([]),
  });
  fields: FormlyFieldConfig[] = [
    {
      fieldGroup: [
        {
          fieldGroupClassName: 'contract-field',
          key: 'name',
          type: 'input',
          templateOptions: {
            required: true,
            translate: true,
            textfieldLabelOutside: true,
            label: 'ADMIN_CONTRACT_MANAGEMENT_COLUMNS.name',
          },
        },
        {
          key: 'status',
          className: 'tui-form__row block',
          type: 'toggle',
          defaultValue: true,
          templateOptions: {
            textfieldLabelOutside: true,
            labelClassName: 'font-semibold',
            required: true,
          },
          expressionProperties: {
            'templateOptions.label': this.translocoService.selectTranslate('ADMIN_CONTRACT_MANAGEMENT_COLUMNS.status'),
            'templateOptions.description': this.form?.valueChanges.pipe(
              startWith(null),
              map((value) => value?.status),
              distinctUntilChanged(),
              switchMap((status) => this.translocoService.selectTranslate(`${status ? 'active' : 'inactive'}`))
            ),
          },
        },
        {
          key: 'workflow',
          type: 'select',
          defaultValue: 'workflow A',
          templateOptions: {
            required: true,
            translate: true,
            label: 'Workflow',
            textfieldLabelOutside: true,
            options: ['workflow A', 'workflow B'],
          },
        },
        {
          className: 'col-span-2',
          key: 'description',
          type: 'text-area',
          templateOptions: {
            required: true,
            translate: true,
            label: 'Description',
            textfieldLabelOutside: true,
          },
        },
      ],
    },
  ];

  constructor(
    private translocoService: TranslocoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onCancel(): void {
    this.router.navigate(['admin/contracts']);
  }
}
