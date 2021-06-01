import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LeaveType } from '../../../../models/leave-type';
import { LeaveTypeService } from '../../../../services/leave-type.service';

interface User {
  readonly name: string;
  readonly email: string;
  readonly status: 'alive' | 'deceased';
  readonly tags: readonly string[];
}

@Component({
  selector: 'hcm-list-leave-type',
  templateUrl: './list-leave-type.component.html',
  styleUrls: ['./list-leave-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListLeaveTypeComponent implements OnInit {
  length = 0;
  index = 0;
  total = 0;

  leaveTypes!: LeaveType[];

  constructor(private leaveTypeService: LeaveTypeService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.leaveTypeService.getLeaveTypes(this.index, 10).subscribe((item) => {
      this.length = item.totalPage;
      this.leaveTypes = item.items;
      this.cdr.detectChanges();
    });
  }

  readonly columns = ['name', 'action'];

  goToPage(index: number) {
    this.index = index;
  }
}
