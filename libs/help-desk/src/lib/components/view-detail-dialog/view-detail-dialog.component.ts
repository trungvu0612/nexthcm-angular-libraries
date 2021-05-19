import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit } from '@angular/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { Router } from '@angular/router';
import { EmployeeInfo } from '@nexthcm/core';
import { MoveSeatDialogComponent } from '../move-seat-dialog/move-seat-dialog.component';

@Component({
  selector: 'hcm-view-detail-dialog',
  templateUrl: './view-detail-dialog.component.html',
  styleUrls: ['./view-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewDetailDialogComponent implements OnInit {
  isAdmin = true;
  availableSeats: any[] = [];
  detail: EmployeeInfo = {
    status: 'Leave',
    cif: '1203001',
    fullName: 'BUI QUI THAN',
    dateOfBirth: '6/12/2021',
    gender: 'Male',
    maritalStatus: 'Married',
    phoneNumber: '0902693533',
    team: 'RVC',
    email: 'vien.nguyen@banvien.com',
    skype: 'vien.nguyen@banvien.com',
    office: 'RVC',
    nationality: 'Vietnam',
    languages: ['Vietnamese', 'English'],
    jobTitle: 'Senior Engineer',
    joinDate: '03/07/2020',
    major: ['Finance and Banking', 'Web HTML5, CSS3, JQUERY, BOOTSTRAP'],
    institute: ['The Banking University of HCMC', 'University of Science HCMC'],
    facebook: 'fb.com/pnhoanghai0307',
    instagram: 'ins.com/pnhoanghai0307',
  };
  status = this.detail.status.toLowerCase().replace('/', '-').split(' ').join('-');

  constructor(
    private dialogService: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<any, any>,
    private injector: Injector,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.availableSeats = this.context.data.seats.flat();
    }
  }

  close(): void {
    this.context.completeWith('close');
  }

  delete(): void {
    this.context.completeWith('delete');
    console.log('delete');
  }

  move(): void {
    this.dialogService
      .open(new PolymorpheusComponent(MoveSeatDialogComponent, this.injector), { size: 's', data: this.availableSeats })
      .subscribe(() => {
        console.log('input');
      });
    this.context.completeWith('move');
    // console.log(
    //   'move',
    //   this.availableSeats.filter((seat) => seat.id === this.inputSeatNumber.value)
    // );
  }

  viewDetail(): void {
    this.context.completeWith('view');
    this.router.navigate(['/human-resource/employees', this.detail.cif]);
  }
}
