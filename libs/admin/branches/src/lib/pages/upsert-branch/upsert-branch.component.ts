import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { BranchesService } from '../../services/branches.service';

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

  dataTest$: Observable<any> = this.branchesService.formlyEdit();

  readonly branchForm = new FormGroup({
    // filters: new FormControl([]),
  });

  model: any = {};
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
        options: this.dataTest$,
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

  constructor(private branchesService: BranchesService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.idBranch = this.activatedRoute.snapshot.paramMap.get('id') as string;

    // this.branchesService.get(this.idBranch).subscribe((data) => {
    //   console.log('dataaaaaaaa', data)
    //   this.model = {...this.model, ...data}
    //   console.log('modelllllll', this.model)
    // })

    this.branchesService.formlyEdit().subscribe((data) => {
      console.log('dataaaaaaaa', data);
      this.model = { ...this.model, ...data };
      console.log('modelllllll', this.model);
    });
  }

  getBranch(): void {}

  submit() {
    alert(JSON.stringify(this.model));
    console.log(this.branchForm.value);
  }
}
