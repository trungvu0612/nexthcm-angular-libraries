import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BranchPost } from '../../../../../branches/src/lib/models/branch';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminPermissionsService } from '../../../../../permissions/src/lib/services/admin-permissions.service';

@Component({
  selector: 'hcm-upsert-user-roles',
  templateUrl: './upsert-user-roles.component.html',
  styleUrls: ['./upsert-user-roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertUserRolesComponent implements OnInit {
  columns = ['name', 'code', 'description', 'lastModifiedDate', 'action'];
  params$ = new BehaviorSubject<{ page?: number; size?: number }>({ size: 10 });
  permissions$: Observable<any[]> = this.adminPermissionsService
    .getPermissions(this.params$.value)
    .pipe(map((data) => data.items));
  // timeValues$: Observable<any[]> = this.myLeaveService.getTimeValues().pipe(map((data) => data));
  readonly branchForm = new FormGroup({});
  model: Partial<BranchPost> = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      className: 'm-8',
      key: 'valueRoles',
      type: 'multi-select',
      templateOptions: {
        options: [
          { id: 1, name: 'Luke Skywalker' },
          { id: 2, name: 'Leia Organa Solo' },
          { id: 3, name: 'Darth Vader' },
          { id: 4, name: 'Han Solo' },
          { id: 5, name: 'Obi-Wan Kenobi' },
          { id: 6, name: 'Yoda' },
        ],
        textfieldSize: 'l',
        labelProp: 'name',
        valueProp: 'name',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'permissions',
      type: 'select-permissions',
      templateOptions: {
        options: this.permissions$,
        labelProp: 'name',
        valueProp: 'id',
      },
    },
  ];

  constructor(private adminPermissionsService: AdminPermissionsService) {}

  ngOnInit(): void {
    // console.log('permission$$$$$',this.permissions$);
  }

  submit() {}

  cancel() {}
}
