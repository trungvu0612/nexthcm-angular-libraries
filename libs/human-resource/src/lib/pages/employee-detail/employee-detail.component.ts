import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EmployeeData } from '../../models/employees';

@Component({
  selector: 'hcm-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailComponent implements OnInit {
  detail: Partial<EmployeeData> = {
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

  canEdit = true;
  isBirthday =
    `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}` == this.detail.dateOfBirth;
  skype = this.sanitizer.bypassSecurityTrustUrl(`skype:${this.detail.skype}?chat`);
  isString = {
    major: typeof this.detail.major == 'string',
    institute: typeof this.detail.institute == 'string',
  };

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}
}
