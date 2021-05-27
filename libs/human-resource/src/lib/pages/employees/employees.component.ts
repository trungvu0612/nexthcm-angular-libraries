import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { EmployeeData } from '../../models/employees';

@Component({
  selector: 'hcm-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class EmployeesComponent implements OnInit {
  inputSearch = new FormControl();
  columns = [
    'cif',
    'fullName',
    'dateOfBirth',
    'gender',
    'maritalStatus',
    'phoneNumber',
    'team',
    'email',
    'skype',
    'office',
  ];
  data: Partial<EmployeeData>[] = [
    {
      cif: '1203001',
      fullName: 'BUI QUI THAN',
      dateOfBirth: '9/27/1993',
      gender: 'Male',
      maritalStatus: 'Married',
      phoneNumber: '0902693533',
      team: 'RVC',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      office: 'RVC',
    },
    {
      cif: '1203001',
      fullName: 'BUI QUI THAN',
      dateOfBirth: '9/27/1993',
      gender: 'Male',
      maritalStatus: 'Married',
      phoneNumber: '0902693533',
      team: 'RVC',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      office: 'RVC',
    },
    {
      cif: '1203001',
      fullName: 'BUI QUI THAN',
      dateOfBirth: '9/27/1993',
      gender: 'Male',
      maritalStatus: 'Married',
      phoneNumber: '0902693533',
      team: 'RVC',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      office: 'RVC',
    },
    {
      cif: '1203001',
      fullName: 'BUI QUI THAN',
      dateOfBirth: '9/27/1993',
      gender: 'Male',
      maritalStatus: 'Married',
      phoneNumber: '0902693533',
      team: 'RVC',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      office: 'RVC',
    },
    {
      cif: '1203001',
      fullName: 'BUI QUI THAN',
      dateOfBirth: '9/27/1993',
      gender: 'Male',
      maritalStatus: 'Married',
      phoneNumber: '0902693533',
      team: 'RVC',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      office: 'RVC',
    },
    {
      cif: '1203001',
      fullName: 'BUI QUI THAN',
      dateOfBirth: '9/27/1993',
      gender: 'Male',
      maritalStatus: 'Married',
      phoneNumber: '0902693533',
      team: 'RVC',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      office: 'RVC',
    },
    {
      cif: '1203001',
      fullName: 'BUI QUI THAN',
      dateOfBirth: '9/27/1993',
      gender: 'Male',
      maritalStatus: 'Married',
      phoneNumber: '0902693533',
      team: 'RVC',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      office: 'RVC',
    },
    {
      cif: '1203001',
      fullName: 'BUI QUI THAN',
      dateOfBirth: '9/27/1993',
      gender: 'Male',
      maritalStatus: 'Married',
      phoneNumber: '0902693533',
      team: 'RVC',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      office: 'RVC',
    },
    {
      cif: '1203001',
      fullName: 'BUI QUI THAN',
      dateOfBirth: '9/27/1993',
      gender: 'Male',
      maritalStatus: 'Married',
      phoneNumber: '0902693533',
      team: 'RVC',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      office: 'RVC',
    },
    {
      cif: '1203001',
      fullName: 'BUI QUI THAN',
      dateOfBirth: '9/27/1993',
      gender: 'Male',
      maritalStatus: 'Married',
      phoneNumber: '0902693533',
      team: 'RVC',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      office: 'RVC',
    },
    {
      cif: '1203001',
      fullName: 'BUI QUI THAN',
      dateOfBirth: '9/27/1993',
      gender: 'Male',
      maritalStatus: 'Married',
      phoneNumber: '0902693533',
      team: 'RVC',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      office: 'RVC',
    },
    {
      cif: '1203001',
      fullName: 'BUI QUI THAN',
      dateOfBirth: '9/27/1993',
      gender: 'Male',
      maritalStatus: 'Married',
      phoneNumber: '0902693533',
      team: 'RVC',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      office: 'RVC',
    },
    {
      cif: '1203001',
      fullName: 'BUI QUI THAN',
      dateOfBirth: '9/27/1993',
      gender: 'Male',
      maritalStatus: 'Married',
      phoneNumber: '0902693533',
      team: 'RVC',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      office: 'RVC',
    },
    {
      cif: '1203001',
      fullName: 'BUI QUI THAN',
      dateOfBirth: '9/27/1993',
      gender: 'Male',
      maritalStatus: 'Married',
      phoneNumber: '0902693533',
      team: 'RVC',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      office: 'RVC',
    },
  ];

  constructor(private destroy$: TuiDestroyService) {}

  ngOnInit(): void {
    this.inputSearch.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(500))
      .subscribe((value) => console.log(value));
  }
}
