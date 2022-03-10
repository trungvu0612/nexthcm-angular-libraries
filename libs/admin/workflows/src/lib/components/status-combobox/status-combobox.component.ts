import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import {
  isPresent,
  TuiActiveZoneDirective,
  TuiIdentityMatcher,
  TuiStringHandler,
  TuiStringMatcher,
} from '@taiga-ui/cdk';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { Status } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';

@Component({
  selector: 'hcm-status-combobox',
  templateUrl: './status-combobox.component.html',
  styleUrls: ['./status-combobox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusComboboxComponent extends FieldType {
  @Input() activeZone: TuiActiveZoneDirective | null = null;
  @Input() addedStatuses: Status[] = [];
  @Output() valueChange = new EventEmitter<Status | null>();

  value: Status | null = null;
  readonly search$ = new BehaviorSubject<string | null>('');
  readonly items$ = this.search$.pipe(
    filter(isPresent),
    distinctUntilChanged(),
    map((search) => this.getStatusList(search))
  );

  constructor(private readonly adminWorkflowsService: AdminWorkflowsService) {
    super();
    adminWorkflowsService.doLoadStatuses();
  }

  readonly stringify: TuiStringHandler<any> = (item: Status) => item.name;
  readonly identityMatcher: TuiIdentityMatcher<any> = (item1: Status, item2: Status) => item1.id === item2.id;
  readonly strictMatcher: TuiStringMatcher<Status> = (
    item: Status,
    search: string,
    stringify: TuiStringHandler<Status>
  ) => !!item.id && stringify(item).toLowerCase() === search.toLowerCase();

  getStatusList(searchQuery: string): Status[] {
    if (!searchQuery) {
      return [];
    }
    const statusList = (this.adminWorkflowsService.get('statuses') || []).filter(
      (status) =>
        status.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 &&
        !this.addedStatuses.find((addedStatus) => addedStatus.id === status.id)
    );

    return statusList.length
      ? statusList
      : searchQuery
      ? this.addedStatuses.find((status) => status.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1)
        ? []
        : [{ name: `${searchQuery}` } as Status]
      : [];
  }

  onValueChange(value: Status | null): void {
    if (this.field) {
      this.formControl?.setValue(value);
    }
    this.valueChange.emit(value);
  }
}
