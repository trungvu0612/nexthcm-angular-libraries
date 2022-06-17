import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BaseOption,
  CommonStatus,
  convertTuiDateTimeToLocalDate,
  FilesService,
  parseTuiDateTime,
  PromptService,
  RolesService,
} from '@nexthcm/cdk';
import { TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { ProviderScope } from '@ngneat/transloco/lib/types';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDay, TuiTime } from '@taiga-ui/cdk';
import omit from 'just-omit';
import { of, Subject } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, tap } from 'rxjs/operators';

import { NotificationType } from '../../enums/notification-type';
import { NotificationItem } from '../../models/notification-item';
import { AdminNotificationsService } from '../../services/admin-notifications.service';

interface NotificationForm extends NotificationItem {
  sendDateCtrl?: [TuiDay, TuiTime | null];
  expiredDateCtrl?: [TuiDay | null, TuiTime | null];
  isRepeat?: boolean;
  statusBoolean?: boolean;
}

@Component({
  selector: 'hcm-upsert-notification',
  templateUrl: './upsert-notification.component.html',
  styleUrls: ['./upsert-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class UpsertNotificationComponent {
  form = this.fb.group({});
  model = {} as NotificationForm;
  data = {} as NotificationForm;
  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          key: 'source',
          type: 'select',
          templateOptions: {
            translate: true,
            required: true,
            label: `${this.translocoScope.scope}.application`,
            labelClassName: 'font-semibold',
            options: this.adminNotificationsService.getApplications(),
            labelProp: 'name',
            valueProp: 'name',
          },
        },
        {
          key: 'type',
          type: 'select',
          defaultValue: NotificationType.Common,
          templateOptions: {
            translate: true,
            required: true,
            label: 'type',
            labelClassName: 'font-semibold',
            options: this.translocoService
              .selectTranslateObject('NOTIFICATION_TYPES', {}, this.translocoScope.scope)
              .pipe(
                map(
                  (result) =>
                    [
                      { value: NotificationType.Common, label: result.common },
                      { value: NotificationType.Birthday, label: result.birthday },
                    ] as BaseOption<NotificationType>[]
                )
              ),
            valueProp: 'value',
          },
        },
      ],
    },
    {
      key: 'title',
      type: 'input',
      className: 'tui-form__row block',
      templateOptions: {
        translate: true,
        required: true,
        label: 'title',
        labelClassName: 'font-semibold',
        placeholder: 'enterTitle',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'shortContent',
      type: 'input',
      className: 'tui-form__row block',
      templateOptions: {
        translate: true,
        required: true,
        label: `${this.translocoScope.scope}.shortContent`,
        labelClassName: 'font-semibold',
        placeholder: `${this.translocoScope.scope}.enterShortContent`,
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'thumbnail',
      className: 'tui-form__row block',
      type: 'upload-file',
      templateOptions: {
        translate: true,
        label: 'image',
        accept: 'image/*',
        labelClassName: 'font-semibold',
        previewImage: true,
        serverRequest: (file: File) => this.filesService.uploadFile('notifications', file),
      },
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          key: 'sendDateCtrl',
          type: 'input-date-time',
          templateOptions: {
            translate: true,
            label: 'startDateTime',
            labelClassName: 'font-semibold',
            placeholder: 'enterStartDateTime',
            textfieldLabelOutside: true,
            required: true,
          },
          expressionProperties: {
            'templateOptions.maxDateTime': (model: NotificationForm) => model.expiredDateCtrl,
          },
        },
        {
          key: 'expiredDateCtrl',
          type: 'input-date-time',
          templateOptions: {
            translate: true,
            label: 'endDateTime',
            labelClassName: 'font-semibold',
            placeholder: 'enterEndDateTime',
            textfieldLabelOutside: true,
          },
          expressionProperties: {
            'templateOptions.minDateTime': (model: NotificationForm) => model.sendDateCtrl,
          },
        },
      ],
    },
    {
      key: 'statusBoolean',
      className: 'tui-form__row block',
      type: 'status-toggle',
      defaultValue: true,
      templateOptions: {
        translate: true,
        label: 'status',
        textfieldLabelOutside: true,
        labelClassName: 'font-semibold',
      },
    },
    {
      key: 'top',
      className: 'tui-form__row block',
      type: 'checkbox-labeled',
      defaultValue: false,
      templateOptions: {
        labelClassName: 'font-semibold',
        translate: true,
        label: `${this.translocoScope.scope}.featured`,
      },
    },
    {
      key: 'isPushMobile',
      className: 'tui-form__row block',
      type: 'checkbox-labeled',
      defaultValue: false,
      templateOptions: {
        labelClassName: 'font-semibold',
        translate: true,
        label: `${this.translocoScope.scope}.pushMobile`,
      },
    },
    {
      key: 'isRepeat',
      className: 'tui-form__row block',
      type: 'checkbox-labeled',
      defaultValue: false,
      templateOptions: {
        labelClassName: 'font-semibold',
        translate: true,
        label: `${this.translocoScope.scope}.repeat`,
      },
    },
    {
      key: 'repeat',
      className: 'tui-form__row block',
      type: 'quartz-cron',
      defaultValue: '0 0 0 ? * * *',
      templateOptions: {
        required: true,
      },
      hideExpression: (model: NotificationForm) => !model.isRepeat,
    },
    {
      key: 'isAllRole',
      className: 'tui-form__row block',
      type: 'checkbox-labeled',
      defaultValue: false,
      templateOptions: {
        labelClassName: 'font-semibold',
        translate: true,
        label: `${this.translocoScope.scope}.allRoles`,
      },
    },
    {
      key: 'roles',
      className: 'tui-form__row block',
      type: 'multi-select',
      templateOptions: {
        translate: true,
        required: true,
        label: 'roles',
        labelClassName: 'font-semibold',
        placeholder: 'chooseRoles',
        options: this.rolesService.roles$,
        matcherBy: 'id',
      },
      hideExpression: (model: NotificationForm) => model.isAllRole,
    },
    {
      key: 'description',
      className: 'tui-form__row block',
      type: 'text-area',
      templateOptions: {
        translate: true,
        textfieldLabelOutside: true,
        label: 'description',
        labelClassName: 'font-semibold',
        placeholder: 'enterDescription',
      },
    },
    {
      key: 'contentDelta',
      className: 'tui-form__row block',
      type: 'quill-template-variables',
      templateOptions: {
        translate: true,
        label: 'content',
        required: true,
        height: '400px',
        onTextChange: (value: string) => this.form.controls['content'].setValue(value),
        variables: this.adminNotificationsService.emailVariables$,
      },
    },
    { key: 'content' },
    { key: 'notifyId' },
  ];

  readonly submit$ = new Subject<NotificationItem>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) => this.adminNotificationsService.upsertNotification(payload).pipe(startWith(null))),
    share()
  );
  readonly submitPrompt$ = this.submitHandler$.pipe(
    filter(isPresent),
    tap(
      this.promptService.handleResponse(
        `${this.translocoScope.scope}.${
          this.notificationId ? 'updateNotificationSuccessfully' : 'createNotificationSuccessfully'
        }`
      )
    )
  );
  readonly submitLoading$ = this.submitHandler$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  private readonly init$ = (this.notificationId
    ? this.adminNotificationsService.getNotification(this.notificationId).pipe(
        tap((notificationItem) => {
          this.data = {
            ...notificationItem,
            isRepeat: !!notificationItem.repeat,
            statusBoolean: notificationItem.status === CommonStatus.active,
          } as NotificationForm;

          if (this.data.sendDate) {
            this.data.sendDateCtrl = parseTuiDateTime(this.data.sendDate);
          }
          if (this.data.expiredDate) {
            this.data.expiredDateCtrl = parseTuiDateTime(this.data.expiredDate);
          }

          this.model = { ...this.model, ...this.data };
        })
      )
    : of({})
  ).pipe(startWith(null), share());

  readonly loading$ = this.init$.pipe(map((value) => !value));

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly fb: UntypedFormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly filesService: FilesService,
    private readonly adminNotificationsService: AdminNotificationsService,
    private readonly promptService: PromptService,
    private readonly state: RxState<Record<string, unknown>>,
    private readonly translocoService: TranslocoService,
    private readonly rolesService: RolesService
  ) {
    rolesService.doLoadRoles();
    adminNotificationsService.doLoadEmailVariables();
    state.hold(this.submitPrompt$);
  }

  get notificationId(): string {
    return this.activatedRoute.snapshot.params['notificationId'];
  }

  onCancel(): void {
    this.router.navigate([this.notificationId ? '../..' : '..'], { relativeTo: this.activatedRoute });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value } as NotificationForm;

      formModel.status = formModel.statusBoolean ? CommonStatus.active : CommonStatus.inactive;
      if (formModel.sendDateCtrl?.[0]) {
        formModel.sendDate = convertTuiDateTimeToLocalDate(
          formModel.sendDateCtrl as [TuiDay, TuiTime | null]
        ).getTime();
      }
      if (formModel.expiredDateCtrl?.[0]) {
        formModel.expiredDate = convertTuiDateTimeToLocalDate(
          formModel.expiredDateCtrl as [TuiDay, TuiTime | null]
        ).getTime();
      }
      this.submit$.next(omit(formModel, ['sendDateCtrl', 'expiredDateCtrl', 'isRepeat', 'statusBoolean']));
    }
  }
}
