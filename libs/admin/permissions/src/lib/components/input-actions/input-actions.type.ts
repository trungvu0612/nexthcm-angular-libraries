import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormBuilder } from '@ngneat/reactive-forms';
import { FieldType } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

@Component({
  selector: 'formly-input-actions',
  templateUrl: './input-actions.type.html',
  // styles: [':host {display: block; padding: 1.75rem;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class InputActionsComponent extends FieldType {
  permissionsForm$ = this.state.select();

  constructor(
    private adminPermissions: AdminPermissionsService,
    private state: RxState<FormArray>,
    private formBuilder: FormBuilder
  ) {
    super();
    this.state.hold(this.adminPermissions.select('actions'), (actions) => {
      const permissionsForm = this.formBuilder.array(
        actions.map((action) =>
          this.formBuilder.group({
            action,
            resources: [],
          })
        )
      );
      this.state.set(permissionsForm);
      this.state.hold(permissionsForm.valueChanges, (permissions) => this.formControl.setValue(permissions));
    });
  }
}
