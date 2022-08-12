import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationSetting, NotificationSettings, NotificationsService, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of, Subject, takeUntil } from 'rxjs';
import { catchError, map, mapTo, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'hcm-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class NotificationSettingsComponent {
  controls!: FormGroup;
  group!: FormGroup;
  modelSetting: NotificationSettings[] = [];
  readonly group$ = new Subject<FormGroup>();
  readonly typeNotifications = [
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
  listActiveNotification!: NotificationSettings[];
  readonly submit$ = new Subject<NotificationSettings[]>();
  readonly submitLoading$ = this.submit$.pipe(
    switchMap((body) =>
      this.notificationsService.updateSettingNotifications(body).pipe(
        mapTo(false),
        tap(this.promptService.handleResponse('updateNotificationSettingSuccessfully', () => this.onCancel())),
        catchError(() => of(false)),
        startWith(true)
      )
    )
  );

  readonly loading$ = this.notificationsService.getSettings().pipe(
    map((settingNotifications) => {
      this.listActiveNotification = settingNotifications.filter((item) => item.moduleName !== 'PROFILE');
      this.columnTitles = this.typeNotifications.map(({ value }) => value);
      const groupConfig: Record<string, FormGroup> = {};
      const controlsConfig: Record<string, FormControl> = {};
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
          controlsConfigColumnNoti[key].valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
            this.columnTitles.forEach((title) => {
              if (key.includes(title)) {
                const notifyId_ = key.replace(title, '');
                const columnTitle = title.charAt(0).toUpperCase() + title.substring(1);
                const nameSoundColumn = 'sound' + columnTitle;
                const newKey = notifyId_ + nameSoundColumn;
                controlsConfigColumnNoti[newKey].setValue(value);
              }
            });
          });
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
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {}

  onCancel(): void {
    this.router.navigateByUrl('/notifications/settings');
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
    this.notificationsService
      .getSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe((settingNotifications) => {
        this.modelSetting = settingNotifications.map((settingNoti) => {
          let notificationSettingItem = settingNoti.listNotifiSetting;
          for (const column of this.typeNotifications) {
            const controls = (this.group.get(column.value) as FormGroup).controls;
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
        this.submit$.next(this.modelSetting);
      });
  }
}
