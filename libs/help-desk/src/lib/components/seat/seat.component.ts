import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { EmployeeInfo, SeatInfo } from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'hcm-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatComponent {
  @Input() seat!: SeatInfo;
  @Input() dimension!: number[];
  @Output() delete = new EventEmitter();

  isAdmin = true;
  detail: Partial<EmployeeInfo> = {
    status: 'Leave',
    fullName: 'BUI QUI THAN',
    dateOfBirth: '6/12/2021',
    phoneNumber: '0902693533',
    team: 'RVC',
    email: 'vien.nguyen@banvien.com',
    skype: 'vien.nguyen@banvien.com',
  };

  status = this.detail.status?.toLowerCase().replace('/', '-').split(' ').join('-');

  constructor(public elementRef: ElementRef, private router: Router) {}

  @HostBinding('style.left') get left() {
    return this.seat.left + '%';
  }

  @HostBinding('style.top') get top() {
    return this.seat.top + '%';
  }

  @HostBinding('style.width') get width() {
    return this.dimension[0] + '%';
  }

  @HostBinding('style.height') get height() {
    return this.dimension[1] + '%';
  }

  onDelete(): void {
    this.delete.emit();
  }

  viewDetail(): void {
    this.router.navigate(['/human-resource/employees', this.detail.cif]);
  }
}
