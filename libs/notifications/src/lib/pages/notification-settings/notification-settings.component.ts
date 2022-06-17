import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of, Subject } from 'rxjs';
import { catchError, map, mapTo, startWith, switchMap } from 'rxjs/operators';

import { NotificationSetting, NotificationSettings } from '../../models/notifications';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'hcm-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class NotificationSettingsComponent {
  controls!: UntypedFormGroup;
  group!: UntypedFormGroup;
  modelSetting: NotificationSettings[] = [];
  readonly group$ = new Subject<UntypedFormGroup>();
  readonly typeNotifications = [
    { value: 'notifyOnHCM', label: '' },
    { value: 'notifyOnDesktop', label: '' },
    {
      value: 'notifyOnMobile',
      label: '',
    },
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
  listActiveNotification: NotificationSettings[] = [];
  readonly submit$ = new Subject<NotificationSettings[]>();
  readonly submitLoading$ = this.submit$.pipe(
    switchMap((body) =>
      this.notificationsService.updateSettingNotifications(body).pipe(
        mapTo(false),
        catchError(() => of(false)),
        startWith(true)
      )
    )
  );

  readonly loading$ = this.notificationsService.getSettings().pipe(
    map((settingNotifications) => {
      this.listActiveNotification = settingNotifications.filter((item) => item.moduleName != 'PROFILE');
      this.columnTitles = this.typeNotifications.map(({ value }) => value);
      const groupConfig: Record<string, UntypedFormGroup> = {};
      const controlsConfig: Record<string, UntypedFormControl> = {};
      this.columnTitles.forEach((column) => {
        const childConfig: Record<string, boolean> = {};
        settingNotifications.forEach((value) => {
          value.listNotifiSetting.forEach((item) => {
            const controlName = item['notifyId'] + '_' + column;
            childConfig[controlName] = item[column as never] === null ? false : item[column as never];
            const columnTitle = column.charAt(0).toUpperCase() + column.substring(1);
            const nameSoundColumn = 'sound' + columnTitle;
            const controlNameSound = item['notifyId'] + '_' + nameSoundColumn;
            childConfig[controlNameSound] =
              item[nameSoundColumn as never] === null ? false : item[nameSoundColumn as never];
          });
        });
        groupConfig[column] = this.fb.group(childConfig);
        controlsConfig[column] = this.fb.control(false);
        const controlsConfigColumnNoti = groupConfig[column].controls;
        for (const key in controlsConfigColumnNoti) {
          settingNotifications.forEach((value) => {
            value.listNotifiSetting.forEach((item) => {
              if (key.includes(item['notifyId'] as string) && !item['active']) {
                controlsConfigColumnNoti[key].disable({ onlySelf: true });
              }
            });
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
    private readonly notificationsService: NotificationsService,
    private readonly destroy$: TuiDestroyService,
    private readonly fb: UntypedFormBuilder,
    private readonly translocoService: TranslocoService
  ) {}

  getControl({
    column,
    array,
    group,
  }: {
    column: any;
    array: any;
    group: UntypedFormGroup;
  }): UntypedFormControl | null {
    const controls = (group.get(column.value) as UntypedFormGroup).controls;
    for (const key in controls) {
      if (
        !key.includes('sound') &&
        key.includes(array.notifyId) &&
        key.length - 1 === column.value.length + array.notifyId.length
      ) {
        return controls[key] as UntypedFormControl;
      }
    }
    return null;
  }

  getControlSound({
    column,
    array,
    group,
  }: {
    column: any;
    array: any;
    group: UntypedFormGroup;
  }): UntypedFormControl | null {
    const controls = (group.get(column.value) as UntypedFormGroup).controls;
    for (const key in controls) {
      if (
        key.includes('sound') &&
        key.includes(array.notifyId) &&
        key.length - 1 === column.value.length + array.notifyId.length + 'sound'.length
      ) {
        return controls[key] as UntypedFormControl;
      }
    }
    return null;
  }

  onSubmit(): void {
    this.notificationsService
      .getSettings()
      .pipe()
      .subscribe((settingNotifications) => {
        const settingNotificationsUpdate = settingNotifications.map((settingNoti) => {
          let notificationSettingItem = settingNoti.listNotifiSetting;
          for (const column of this.typeNotifications) {
            const controls = (this.group.get(column.value) as UntypedFormGroup).controls;
            notificationSettingItem = notificationSettingItem.map((value) => {
              const controlName = value['notifyId'] + '_' + column.value;
              const valueCheckbox = controls[controlName].value;
              const title = column.value as string;
              return { ...value, [title as keyof NotificationSetting]: valueCheckbox };
            });
            notificationSettingItem = notificationSettingItem.map((value) => {
              const columnTitle = column.value.charAt(0).toUpperCase() + column.value.substring(1);
              const nameSoundColumn = 'sound' + columnTitle;
              const controlNameSound = value['notifyId'] + '_' + nameSoundColumn;
              const valueCheckbox = controls[controlNameSound].value;
              const title = nameSoundColumn as string;
              return { ...value, [title as keyof NotificationSetting]: valueCheckbox };
            });
          }
          return { ...settingNoti, listNotifiSetting: notificationSettingItem };
        });

        this.modelSetting = settingNotificationsUpdate;
        this.submit$.next(this.modelSetting);
      });
  }
}
