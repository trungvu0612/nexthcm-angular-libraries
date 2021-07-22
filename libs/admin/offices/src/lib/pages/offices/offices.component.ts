import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { Zone } from '@nexthcm/core';
import { PromptService } from '@nexthcm/ui';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { DefaultConfig } from 'ngx-easy-table';
import { BehaviorSubject, Subscriber } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { AdminOfficesService } from '../../services/admin-offices.service';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'hcm-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficesComponent {
  readonly configuration = { ...DefaultConfig, paginationEnabled: false, fixedColumnWidth: false };
  readonly columns$ = this.translocoService.selectTranslateObject('ZONE_TABLE').pipe(
    map((translate) => [
      { key: 'name', title: translate.name },
      { key: 'address', title: translate.address },
      { key: 'description', title: translate.description },
      { key: 'action', title: translate.action },
    ])
  );
  readonly params$ = new BehaviorSubject<{ [key: string]: number }>({ size: 10 });
  readonly data$ = this.params$.pipe(switchMap((params) => this.adminOfficesService.getOffices(params)));
  readonly form = new FormGroup({});
  model!: Partial<Zone>;
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'officeName',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'address',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'address',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'description',
      type: 'text-area',
      templateOptions: {
        label: 'description',
        translate: true,
        textfieldLabelOutside: true,
      },
    },
  ];

  constructor(
    private readonly adminOfficesService: AdminOfficesService,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private promptService: PromptService
  ) {}

  upsertOffice(content: PolymorpheusContent<TuiDialogContext>, office?: Partial<Zone>): void {
    this.model = office || { status: 0, longitude: 0, latitude: 0 };
    this.dialogService
      .open(content, {
        label: this.translocoService.translate(this.model.id ? 'editOffice' : 'createOffice'),
      })
      .subscribe();
  }

  submitOffice(observer: Subscriber<unknown>): void {
    if (this.form.valid) {
      observer.complete();
      this.adminOfficesService[this.model.id ? 'editOffice' : 'createOffice'](this.model)
        .pipe(switchMap(() => this.promptService.open({ icon: 'success' } as SweetAlertOptions)))
        .subscribe(() => this.params$.next(this.params$.value));
    }
  }

  deleteOffice(id: string) {
    console.log(id);
  }

  changePagination(key: 'page' | 'size', value: number): void {
    this.params$.next({ ...this.params$.value, [key]: value });
  }
}
