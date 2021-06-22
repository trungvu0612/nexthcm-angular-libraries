import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { FieldType } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { Service } from '../../models/policy';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

@Component({
  selector: 'formly-input-service',
  templateUrl: './input-service.type.html',
  styles: [':host {display: flex; padding: 1.75rem 1.75rem 0 20%;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class InputServiceComponent extends FieldType {
  expanded = false;
  searchControl = new FormControl<string>('');
  services$ = this.adminPermissions.getServices();

  constructor(private adminPermissions: AdminPermissionsService) {
    super();
  }

  chooseService(service: Partial<Service>): void {
    this.formControl.patchValue(service);
    this.toggleExpanded();
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }
}
