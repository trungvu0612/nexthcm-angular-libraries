import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PermissionForm } from '../../models/policy';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

@Component({
  selector: 'hcm-formly-input-actions',
  templateUrl: './input-actions.type.html',
  styleUrls: ['./input-actions.type.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class InputActionsComponent extends FieldType implements OnInit {
  expanded$ = new BehaviorSubject(false);
  permissionsForm!: FormArray;

  constructor(
    private adminPermissions: AdminPermissionsService,
    private formBuilder: FormBuilder,
    private destroy$: TuiDestroyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.adminPermissions.select('actions').subscribe((sources) => {
      this.permissionsForm = this.formBuilder.array(
        sources.map((action) => {
          const permission = (this.formControl?.value as PermissionForm[])?.filter(
            (permission) => permission.action.id === action.id
          )[0];
          return new FormGroup({
            action: new FormControl(action),
            resource: new FormControl(permission?.resource || []),
          });
        })
      );

      this.permissionsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((permissions) => {
        this.formControl?.setValue(permissions);
      });
    });

    const service = this.form.get('service');
    if (service) {
      const expand = (value: unknown) => value && !this.expanded$.value && this.toggleExpanded();
      expand(service.value);
      service.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(expand);
    }
  }

  toggleExpanded(): void {
    this.expanded$.next(!this.expanded$.value);
  }
}
