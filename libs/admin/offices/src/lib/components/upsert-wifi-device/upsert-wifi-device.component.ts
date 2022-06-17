import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { CommonStatus, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext, TuiTextMaskOptions } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import omit from 'just-omit';
import { from, of, share, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';

import { WifiDevice } from '../../models/wifi-device';
import { AdminOfficesService } from '../../services/admin-offices.service';

interface WifiDeviceForm extends WifiDevice {
  statusBoolean?: boolean;
}

@Component({
  selector: 'hcm-upsert-wifi-device',
  templateUrl: './upsert-wifi-device.component.html',
  styleUrls: ['./upsert-wifi-device.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertWifiDeviceComponent implements OnInit {
  readonly form = this.fb.group({});
  model = {} as WifiDeviceForm;
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'wifiSSID',
      type: 'input',
      className: 'tui-form__row block',
      templateOptions: {
        translate: true,
        required: true,
        label: `${this.translocoScope.scope}.SSID`,
        labelClassName: 'font-semibold',
        placeholder: `${this.translocoScope.scope}.enterSSID`,
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'macAddress',
      type: 'input',
      className: 'tui-form__row block',
      templateOptions: {
        translate: true,
        required: true,
        label: `${this.translocoScope.scope}.MACAddress`,
        labelClassName: 'font-semibold',
        pattern: /^[a-fA-F0-9]{2}(-[a-fA-F0-9]{2}){5}$/,
        textfieldLabelOutside: true,
        textMask: {
          mask: () => [
            /[a-fA-F0-9]/,
            /[a-fA-F0-9]/,
            '-',
            /[a-fA-F0-9]/,
            /[a-fA-F0-9]/,
            '-',
            /[a-fA-F0-9]/,
            /[a-fA-F0-9]/,
            '-',
            /[a-fA-F0-9]/,
            /[a-fA-F0-9]/,
            '-',
            /[a-fA-F0-9]/,
            /[a-fA-F0-9]/,
            '-',
            /[a-fA-F0-9]/,
            /[a-fA-F0-9]/,
          ],
          showMask: true,
          guide: true,
          keepCharPositions: true,
        } as TuiTextMaskOptions,
      },
      validation: {
        messages: {
          pattern: (error, field) =>
            this.translocoService.selectTranslate(
              'invalidMACAddress',
              { value: field.formControl?.value },
              this.translocoScope
            ),
        },
      },
    },
    {
      key: 'statusBoolean',
      className: 'tui-form__row block',
      type: 'status-toggle',
      templateOptions: {
        translate: true,
        label: 'status',
        textfieldLabelOutside: true,
        labelClassName: 'font-semibold',
      },
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
    { key: 'id' },
    { key: 'officeId' },
  ];
  readonly submit$ = new Subject<WifiDevice>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.adminOfficesService.upsertNetworkDevice(payload).pipe(
        switchMap(() =>
          from(
            this.promptService.open({
              icon: 'success',
              html: this.translocoService.translate(
                `${this.translocoScope.scope}.${
                  payload.id ? 'editWifiDeviceSuccessfully' : 'addWifiDeviceSuccessfully'
                }`
              ),
            })
          )
        ),
        tap(() => this.context.completeWith(true)),
        catchError((err) =>
          from(
            this.promptService.open({
              icon: 'error',
              html: this.promptService.generateErrorMessage(err),
            })
          )
        ),
        startWith(null)
      )
    ),
    share()
  );
  readonly submitLoading$ = this.submitHandler$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) private readonly translocoScope: ProviderScope,
    private readonly fb: UntypedFormBuilder,
    private readonly translocoService: TranslocoService,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, WifiDevice>,
    private readonly adminOfficesService: AdminOfficesService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model = {
        ...this.model,
        ...this.context.data,
        statusBoolean: this.context.data.state === CommonStatus.active,
      };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel: WifiDeviceForm = { ...this.form.value };

      this.submit$.next(omit(formModel, 'statusBoolean'));
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
