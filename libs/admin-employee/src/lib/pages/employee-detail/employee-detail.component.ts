import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private AdminEmployeeService: AdminEmployeeService,
    private activatedRouter: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.userId = this.activatedRouter.snapshot.params.id;
  }

  ngOnInit(): void {
    if (this?.userId) {
      this.AdminEmployeeService.getUserById(this.userId).subscribe((userData) => {
        this.userInfo = userData;
        console.log(this.userInfo);
        this.cdr.markForCheck();
      });
    }
  }
}
