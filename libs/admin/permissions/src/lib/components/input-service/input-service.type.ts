import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { FieldType } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { ServiceInfo } from '../../models/permission';

@Component({
  selector: 'formly-input-service',
  templateUrl: './input-service.type.html',
  styles: [':host {display: flex; padding: 1.75rem 1.75rem 1.75rem 20%; border-bottom: 1px solid black;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class InputServiceComponent extends FieldType {
  expanded = false;
  searchControl = new FormControl<string>('');

  constructor() {
    super();
  }

  get services(): ServiceInfo[] {
    return (this.to.options as ServiceInfo[]).filter(
      (service) => service.name.toLowerCase().indexOf(this.searchControl.value.toLowerCase()) > -1
    );
  }

  chooseService(service: ServiceInfo): void {
    this.formControl.patchValue(service);
    this.toggleExpanded();
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }
}
