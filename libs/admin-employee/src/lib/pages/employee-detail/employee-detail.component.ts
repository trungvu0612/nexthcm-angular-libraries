import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminEmployeeService } from '../../services/admin-employee.service';
import {GENDER_NAME, MARITAL_STATUS} from "../../models/employee-enum";
import {UploadFileService} from "@nexthcm/ui";

@Component({
  selector: 'hcm-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailComponent implements OnInit {
  userId!: string;
  userInfo: any;
  dataMarital$ = MARITAL_STATUS;
  dataGender$ = GENDER_NAME;
  constructor(
    private AdminEmployeeService: AdminEmployeeService,
    private activatedRouter: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private uploadFileService: UploadFileService
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
