import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { TuiIdentityMatcher } from '@taiga-ui/cdk';

import { Service } from '../../models/policy';

@Component({
  selector: 'hcm-formly-input-service',
  templateUrl: './input-service.type.html',
  styleUrls: ['./input-service.type.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputServiceComponent extends FieldType implements OnInit {
  expanded = true;
  filterControl = new FormControl();
  matcher: TuiIdentityMatcher<Service> = (item1, item2) => item1.id === item2.id;

  ngOnInit(): void {
    this.formControl?.value && this.filterControl.setValue([this.formControl.value]);
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  selectService(service: Partial<Service>): void {
    const value = this.formControl?.value?.id === service.id ? null : service;
    this.formControl?.setValue(value);
    this.filterControl.setValue([]);
    if (value) this.toggleExpanded();
  }
}
