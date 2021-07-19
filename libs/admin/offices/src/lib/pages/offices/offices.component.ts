import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { Zone } from '@nexthcm/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject } from 'rxjs';
import { OfficeDetailDialogComponent } from '../../components/office-detail-dialog/office-detail-dialog.component';
import { AdminOfficesService } from '../../services/admin-offices.service';
import { map, switchMap } from 'rxjs/operators';
import { DefaultConfig } from 'ngx-easy-table';
import { TranslocoService } from '@ngneat/transloco';
import { SweetAlertOptions } from 'sweetalert2';
import { PromptComponent } from '@nexthcm/ui';

@Component({
  selector: 'hcm-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficesComponent {
  @ViewChild('prompt') prompt!: PromptComponent;
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
  readonly data$ = this.params$.pipe(switchMap(() => this.adminOfficesService.getOffices(this.params$.value)));

  constructor(
    private readonly adminOfficesService: AdminOfficesService,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector
  ) {}

  upsertOffice(office?: Partial<Zone>): void {
    this.dialogService
      .open<Partial<Zone>>(new PolymorpheusComponent(OfficeDetailDialogComponent, this.injector), {
        size: 'l',
        data: office || {},
      })
      .subscribe((result) => {
        if (result)
          this.adminOfficesService[office ? 'editOffice' : 'createOffice'](result)
            .pipe(switchMap(() => this.prompt.open({ icon: 'success' } as SweetAlertOptions)))
            .subscribe(() => this.params$.next(this.params$.value));
      });
  }

  deleteOffice(id: string) {
    console.log(id);
  }

  changePagination(key: 'page' | 'size', value: number): void {
    this.params$.next({ ...this.params$.value, [key]: value });
  }
}
