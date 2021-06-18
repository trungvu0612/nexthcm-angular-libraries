import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Zone } from '@nexthcm/ui';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AdminOfficesService } from '../../services/admin-offices.service';

@Component({
  selector: 'formly-input-office',
  templateUrl: './input-office.component.html',
  styleUrls: ['./input-office.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOfficeComponent extends FieldType {
  offices$ = this.adminOfficesService.getZoneData('office').pipe(
    switchMap((data) =>
      this.adminOfficesService.getZoneData('office', {
        page: 0,
        size: data.totalElements || 10,
      })
    )
  );
  search$ = new BehaviorSubject('');
  items$ = combineLatest([this.offices$, this.search$]).pipe(
    map(([office, search]) =>
      office.items?.filter((item) => {
        return item.name ? item.name.toLowerCase().indexOf(search.toLowerCase()) > -1 : false;
      })
    )
  );
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldLabelOutside: true,
      textfieldCleaner: true,
      stringify: (item: Partial<Zone>) => item.name || '',
    },
  };

  constructor(private adminOfficesService: AdminOfficesService) {
    super();
  }
}
