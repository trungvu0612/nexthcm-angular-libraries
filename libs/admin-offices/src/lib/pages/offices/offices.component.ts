import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subject } from 'rxjs';
import { OfficeDetailDialogComponent } from '../../components/office-detail-dialog/office-detail-dialog.component';
import { OfficeDetail, Zone } from '../../models/offices';
import { AdminOfficesService } from '../../services/admin-offices.service';

@Component({
  selector: 'hcm-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficesComponent {
  refresh$ = new Subject();

  constructor(
    private adminOfficesService: AdminOfficesService,
    private dialogService: TuiDialogService,
    private injector: Injector
  ) {}

  showDialog(data?: Partial<OfficeDetail>): Observable<Partial<OfficeDetail>> {
    return this.dialogService.open<Partial<OfficeDetail>>(
      new PolymorpheusComponent(OfficeDetailDialogComponent, this.injector),
      {
        size: 'l',
        data: data,
      }
    );
  }

  onAdd(): void {
    this.showDialog().subscribe((detail) => {
      if (detail) this.adminOfficesService.addOffice(detail).subscribe(() => this.refresh$.next());
    });
  }

  onEdit(item: Partial<Zone>): void {
    this.showDialog(item).subscribe();
  }

  onRemove(item: Partial<Zone>): void {
    console.log(item);
  }
}
