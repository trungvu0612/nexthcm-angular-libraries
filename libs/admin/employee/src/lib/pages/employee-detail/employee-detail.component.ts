import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GENDER_NAME, MARITAL_STATUS } from '../../models/employee-constants';
import { AdminEmployeeService } from '../../services/admin-employee.service';

@Component({
  selector: 'hcm-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailComponent implements OnInit {
  userId!: string;
  userInfo: any;
  dataMarital = MARITAL_STATUS;
  dataGender = GENDER_NAME;

  constructor(
    private adminEmployeeService: AdminEmployeeService,
    private activatedRouter: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.userId = this.activatedRouter.snapshot.params.id;
  }

  ngOnInit(): void {
    if (this.userId) {
      this.adminEmployeeService.getUserById(this.userId).subscribe((userData) => {
        this.userInfo = userData;
        this.cdr.markForCheck();
      });
    }
  }
}
