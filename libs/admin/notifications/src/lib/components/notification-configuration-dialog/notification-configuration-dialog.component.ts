import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { combineLatest, of, Subject } from 'rxjs';
import { catchError, map, mapTo, startWith, switchMap } from 'rxjs/operators';

import { NotificationSettingItem, NotificationSettingResponse } from '../../models/notification-setting';
import { AdminNotificationsService } from '../../services/admin-notifications.service';

@Component({
  selector: 'hcm-notification-configuration-dialog',
  templateUrl: './notification-configuration-dialog.component.html',
  styleUrls: ['./notification-configuration-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationConfigurationDialogComponent {
  controls!: FormGroup;
  group!: FormGroup;
  modelSetting = { listNotifiSetting: [], userId: '' } as NotificationSettingResponse;
  readonly group$ = new Subject<FormGroup>();
  readonly typeNotifications = [
    { value: 'sendToMail', label: '' },
    { value: 'notifyOnHCM', label: '' },
    {
      value: 'notifyOnMobile',
      label: '',
    },
    { value: 'notifyOnDesktop', label: '' },
  ];
  readonly typeActives = [
    { value: 'checkInCheckout', isTitle: true },
    {
      value: 'myTime',
      isTitle: true,
    },
    { value: 'seatMap', isTitle: true },

    { value: 'knowledgeBase', isTitle: true },
    { value: 'tenantManagement', isTitle: true },
  ];

  columnTitles!: string[];
  listActiveNotification!: any[];
  readonly submit$ = new Subject<NotificationSettingResponse>();
  readonly submitLoading$ = this.submit$.pipe(
    switchMap((body) =>
      this.adminNotificationsService.updateSettingNotifications(body).pipe(
        mapTo(false),
        catchError(() => of(false)),
        startWith(true)
      )
    )
  );
  readonly loading$ = combineLatest([
    this.adminNotificationsService.settingNotifications$,
    this.adminNotificationsService.configNotifications$,
  ]).pipe(
    map(([settingNotifications, configNotifications]) => {
      const notificationSettingItem = settingNotifications.listNotifiSetting;
      const listEnableNotifications = configNotifications.filter((value) => value.modifieldNotify);
      // handle add test data for the fields modulename
      // notificationSettingItem = notificationSettingItem.map((value) => {
      //   return { ...value, moduleName: 'checkInCheckout'
      // };
      // });
      //// end test data
      this.listActiveNotification = this.typeActives.map((item) => {
        const listSetting = notificationSettingItem.filter((element) => element.moduleName === item.value);
        return {
          ...item,
          listSetting,
        };
      });
      this.columnTitles = this.typeNotifications.map(({ value }) => value);
      const groupConfig: Record<string, FormGroup> = {};
      const controlsConfig: Record<string, FormControl> = {};

      this.columnTitles.forEach((column) => {
        const childConfig: Record<string, boolean> = {};
        notificationSettingItem.forEach((item) => {
          const controlName = item['notifyId'] + '_' + column;
          childConfig[controlName] = item[column as never];
          const columnTitle = column.charAt(0).toUpperCase() + column.substring(1);
          const nameSoundColumn = 'sound' + columnTitle;
          const controlNameSound = item['notifyId'] + '_' + nameSoundColumn;
          childConfig[controlNameSound] = item[nameSoundColumn as never];
        });
        groupConfig[column] = this.fb.group(childConfig);
        controlsConfig[column] = this.fb.control(false);
        const controlsConfigColumnNoti = groupConfig[column].controls;
        for (const key in controlsConfigColumnNoti) {
          listEnableNotifications.forEach((enableNoti) => {
            if (key.includes(enableNoti.notifyID as string)) {
              controlsConfigColumnNoti[key].disable({ onlySelf: true });
            }
          });
        }
      });
      this.controls = this.fb.group(controlsConfig);
      this.group = this.fb.group(groupConfig);
      this.group$.next(this.group);
      return false;
    }),
    startWith(true)
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly fb: FormBuilder,
    private readonly adminNotificationsService: AdminNotificationsService
  ) {
    adminNotificationsService.doSettingNotifications();
    adminNotificationsService.doConfigNotifications();
  }
  getControl({ column, array, group }: { column: any; array: any; group: FormGroup }): FormControl | null {
    const controls = (group.get(column.value) as FormGroup).controls;
    for (const key in controls) {
      if (
        !key.includes('sound') &&
        key.includes(array.notifyId) &&
        key.length - 1 === column.value.length + array.notifyId.length
      ) {
        return controls[key] as FormControl;
      }
    }
    return null;
  }

  getControlSound({ column, array, group }: { column: any; array: any; group: FormGroup }): FormControl | null {
    const controls = (group.get(column.value) as FormGroup).controls;
    for (const key in controls) {
      if (
        key.includes('sound') &&
        key.includes(array.notifyId) &&
        key.length - 1 === column.value.length + array.notifyId.length + 'sound'.length
      ) {
        return controls[key] as FormControl;
      }
    }
    return null;
  }
  onSubmit(): void {
    this.adminNotificationsService.settingNotifications$.pipe().subscribe((settingNotifications) => {
      let notificationSettingItem = settingNotifications.listNotifiSetting;
      for (const column of this.typeNotifications) {
        const controls = (this.group.get(column.value) as FormGroup).controls;
        notificationSettingItem = notificationSettingItem.map((value) => {
          const controlName = value['notifyId'] + '_' + column.value;
          const valueCheckbox = controls[controlName].value;
          const title = column.value as string;
          return { ...value, [title as keyof NotificationSettingItem]: valueCheckbox };
        });
        notificationSettingItem = notificationSettingItem.map((value) => {
          const columnTitle = column.value.charAt(0).toUpperCase() + column.value.substring(1);
          const nameSoundColumn = 'sound' + columnTitle;
          const controlNameSound = value['notifyId'] + '_' + nameSoundColumn;
          const valueCheckbox = controls[controlNameSound].value;
          const title = nameSoundColumn as string;
          return { ...value, [title as keyof NotificationSettingItem]: valueCheckbox };
        });
      }
      this.modelSetting.listNotifiSetting = notificationSettingItem;
      this.modelSetting.userId = settingNotifications.userId;
      this.submit$.next(this.modelSetting);
    });
  }
}
