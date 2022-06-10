import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { catchError, combineLatest, of, Subject } from 'rxjs';
import { map, mapTo, startWith, switchMap } from 'rxjs/operators';

import { NotificationConfigItem, NotificationConfigResponse } from '../../models/notification-config';
import { AdminNotificationsService } from '../../services/admin-notifications.service';

@Component({
  selector: 'hcm-notification-configuration',
  templateUrl: './notification-configuration.component.html',
  styleUrls: ['./notification-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationConfigurationComponent {
  controls!: FormGroup;
  group!: FormGroup;
  modelConfig = { listNotifiConfig: [{}] } as NotificationConfigResponse<NotificationConfigItem>;
  readonly group$ = new Subject<FormGroup>();
  readonly typeNotifications = [
    { value: 'sendToMail', label: '' },
    { value: 'notifyOnHCM', label: '' },
    {
      value: 'notifyOnMobile',
      label: '',
    },
    { value: 'notifyOnDesktop', label: '' },
    { value: 'modifieldNotify', label: 'lastTitle' },
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
  readonly submit$ = new Subject<NotificationConfigResponse<NotificationConfigItem>>();
  readonly submitLoading$ = this.submit$.pipe(
    switchMap((body) =>
      this.adminNotificationsService.updateConfigNotifications(body).pipe(
        mapTo(false),
        catchError(() => of(false)),
        startWith(true)
      )
    )
  );
  readonly loading$ = combineLatest([this.adminNotificationsService.configNotifications$]).pipe(
    map(([configNotifications]) => {
      // handle add test data for the fields modulename
      // configNotifications = configNotifications.map((value) => {
      //   return { ...value, moduleName: 'checkInCheckout' };
      // });

      this.listActiveNotification = this.typeActives.map((item) => {
        const listConfig = configNotifications.filter((element) => element.moduleName === item.value);
        return {
          ...item,
          listConfig,
        };
      });
      this.columnTitles = this.typeNotifications.map(({ value }) => value);
      const groupConfig: Record<string, FormGroup> = {};
      const controlsConfig: Record<string, FormControl> = {};

      this.columnTitles.forEach((column) => {
        const childConfig: Record<string, boolean> = {};
        configNotifications.forEach((item) => {
          const controlName = item['notifyID'] + '_' + column;
          childConfig[controlName] = item[column as never];
        });
        groupConfig[column] = this.fb.group(childConfig);
        controlsConfig[column] = this.fb.control(false);
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
    private readonly router: Router,
    private readonly adminNotificationsService: AdminNotificationsService
  ) {
    adminNotificationsService.doConfigNotifications();
  }
  onSubmit(): void {
    this.adminNotificationsService.configNotifications$.pipe().subscribe((configNotifications) => {
      for (const column of this.typeNotifications) {
        const controls = (this.group.get(column.value) as FormGroup).controls;
        configNotifications = configNotifications.map((value) => {
          const controlName = value['notifyID'] + '_' + column.value;
          const valueCheckbox = controls[controlName].value;
          const title = column.value as string;
          return { ...value, [title as keyof NotificationConfigItem]: valueCheckbox };
        });
      }
      this.modelConfig.listNotifiConfig = configNotifications;
      this.submit$.next(this.modelConfig);
    });
  }
  getControl({ column, array, group }: { column: any; array: any; group: FormGroup }): FormControl | null {
    const controls = (group.get(column.value) as FormGroup).controls;
    for (const key in controls) {
      if (key.includes(array.notifyID) && key.length - 1 === column.value.length + array.notifyID.length) {
        return controls[key] as FormControl;
      }
    }
    return null;
  }
}
