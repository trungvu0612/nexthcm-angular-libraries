import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { TuiContextWithImplicit, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { Columns } from 'ngx-easy-table';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

interface SyncType {
  readonly id: number;
  readonly name: string;
}

const ITEMS: ReadonlyArray<SyncType> = [
  { id: 42, name: 'Cron' },
  { id: 237, name: 'Interval' },
];

@Component({
  selector: 'hcm-synchronize-settings',
  templateUrl: './synchronize-settings.component.html',
  styleUrls: ['./synchronize-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SynchronizeSettingsComponent implements OnInit {
  public configuration?: any;
  public columns$: Observable<Columns[]> = this.translocoService.selectTranslateObject('SYNCHRONIZE').pipe(
    map((result) => [
      { key: 'nameFunction', title: result.nameFunction },
      { key: 'description', title: result.description },
      { key: 'type', title: result.type },
      { key: 'value', title: result.value },
      { key: 'status', title: result.status },
      { key: 'action', title: result.action },
    ])
  );

  syncForm = new FormGroup({
    statusValue0: new FormControl(true),
    statusValue1: new FormControl(false),
    statusValue2: new FormControl(true),
    statusValue3: new FormControl(false),
    syncType: new FormControl(42),
  });
  public data: any = [
    {
      name: 'Sync user LDAP',
      description:
        'Name "cron.account-keycloak-sync.enabled"\n' +
        '- sync tất cả user LDAP chưa tồn tại trong hệ thống mới với điều kiện cho phép đồng bộ trong hệ thống\n' +
        '- thời gian cập nhật: phút thứ 15 của mỗi giờ.',
    },
    {
      name: 'Sync report to of user LDAP',
      description:
        'Name =  "sync tất cả report to của user LDAP đã sync trước đó(1) với điều kiện cho phép đồng bộ nhân viên. Thời gian cập nhật: phút thứ 20 của mỗi giờ.',
    },
    {
      name: 'Sync infor of user LDAP',
      description:
        'sync tất cả thông tin bao gồm: companyEmail, personalEmail, birthDate, phoneNumber, onboardDate, issueOn, issueAt, idNumber, gender, maritalStatus. Thời gian cập nhật: phút thứ 25 của mỗi giờ.',
    },
    {
      name: 'Sync infor of user LDAP',
      description: 'sync tất cả thông tin bao gồm trong mytime. Thời gian cập nhật: Mỗi 15 phút',
    },
  ];

  // Server request for items imitation
  readonly items$ = of(ITEMS).pipe(delay(3000));

  constructor(private translocoService: TranslocoService) {}

  @tuiPure
  stringify(items: ReadonlyArray<SyncType>): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(items.map(({ id, name }) => [id, name] as [number, string]));

    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || '';
  }

  ngOnInit(): void {}
}

export class SynchronizeSettingsComponentModule {}
