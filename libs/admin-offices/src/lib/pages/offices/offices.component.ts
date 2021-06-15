import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { OfficeDetail, Zone } from '../../models/offices';
import { AdminOfficesService } from '../../services/admin-offices.service';
import { TuiDialogService } from '@taiga-ui/core';
import { OfficeDetailDialogComponent } from '../../components/office-detail-dialog/office-detail-dialog.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';

@Component({
  selector: 'hcm-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficesComponent implements OnInit {
  officesRequest!: Zone[];
  columns = ['name', 'adder', 'description', 'address', 'numberOfRoom', 'action'];

  constructor(
    private adminOfficesService: AdminOfficesService,
    private dialogService: TuiDialogService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.getOfficeList();
  }

  getOfficeList(): void {
    this.adminOfficesService.getOfficeList().subscribe((data) => (this.officesRequest = data));
  }

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
      if (detail) this.adminOfficesService.addOffice(detail).subscribe(() => this.getOfficeList());
    });
  }

  onEdit(index: number): void {
    const { name, description, address } = this.officesRequest[index];
    this.showDialog({ name, description, address }).subscribe((detail) => {
      if (detail)
        this.adminOfficesService
          .editOffice(Object.assign(this.officesRequest[index], detail))
          .subscribe(() => this.getOfficeList());
    });
  }

  onRemove(index: number): void {
    console.log(index);
  }
}
