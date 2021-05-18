import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hcm-view-detail-dialog',
  templateUrl: './view-detail-dialog.component.html',
  styleUrls: ['./view-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewDetailDialogComponent implements OnInit {
  isAdmin = true;
  detail = {
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

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext, private router: Router) {}

  ngOnInit(): void {}

  close(): void {
    this.context.completeWith();
  }

  delete(): void {
    this.context.completeWith();
    console.log('delete');
  }

  move(): void {
    this.context.completeWith();
    console.log('move');
  }

  viewDetail(): void {
    this.context.completeWith();
    this.router.navigate(['/human-resource/employees', this.detail.cif]);
  }
}
