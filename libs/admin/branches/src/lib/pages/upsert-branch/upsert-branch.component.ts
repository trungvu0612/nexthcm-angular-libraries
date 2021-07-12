import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { BranchesService } from '../../services/branches.service';
import { BranchPost } from '../../models/branch';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';

@Component({
  selector: 'hcm-upsert-branch',
  templateUrl: './upsert-branch.component.html',
  styleUrls: ['./upsert-branch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertBranchComponent implements OnInit {

  id!: string;
  idBranch!: string;
  // dataTest$: Observable<any> = this.branchesService.getBranchDatas(0, 10).pipe(map(data => data.data.items));

  // dataTest$: Observable<any> = this.branchesService.formlyEdit();

  readonly branchForm = new FormGroup({});
  model: Partial<BranchPost> = this.context.data || {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      className: 'm-8',
      key: 'name',
      type: 'input',
      templateOptions: {
        textfieldSize: 'l',
        label: 'branchName',
      },
    },

    {
      className: 'col-span-full',
      key: 'description',
      type: 'text-area',
      templateOptions: {
        label: 'description',
        textfieldSize: 'l',
        expandable: false,
        rows: 4,
      },
    },

    {
      className: 'm-8',
      key: 'branchAddress',
      type: 'input',
      templateOptions: {
        textfieldSize: 'l',
        label: 'branchAddress',
      },
    },

    {
      className: 'm-8',
      key: 'obj.nameObj',
      type: 'select',
      templateOptions: {
        options: [],
        labelProp: 'obj.nameObj',
        valueProp: 'obj.nameObj',
        placeholder: 'Admin Name',
      },
    },

    {
      key: 'office',
      type: 'select',
      templateOptions: {
        placeholder: 'Office Name',
      },
    },

    {
      key: 'officeArray',
      type: 'repeat',
      templateOptions: {
        addText: 'Add Offices',
      },
      fieldArray: {
        fieldGroup: [
          {
            key: 'officeArr',
            type: 'select',
            templateOptions: {
              placeholder: 'Office Name',
            },
          },
        ],
      },
    },

  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<boolean>,
    private branchesService: BranchesService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.idBranch = this.activatedRoute.snapshot.paramMap.get('id') as string;

    // this.branchesService.get(this.idBranch).subscribe((data) => {
    //   console.log('dataaaaaaaa', data)
    //   this.model = {...this.model, ...data}
    //   console.log('modelllllll', this.model)
    // })

    // this.branchesService.formlyEdit().subscribe((data) => {
    //   this.model = { ...this.model, ...data };
    // });
  }

  getBranch(): void {}

  submit() {
    // alert(JSON.stringify(this.model));
    console.log(this.branchForm.value);
  }

  cancel() {

  }

  save() {

  }
}
