import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Seat } from '@nexthcm/ui';

@Component({
  selector: 'hcm-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatComponent implements OnInit {
  @Input() seat!: Partial<Seat>;
  @Output() delete = new EventEmitter();
  isAdmin = true;
  @HostBinding('class') status!: string;

  constructor(public elementRef: ElementRef, private router: Router) {}

  @HostBinding('style.left') get left() {
    return this.seat.positionX + '%';
  }

  @HostBinding('style.top') get top() {
    return this.seat.positionY + '%';
  }

  @HostBinding('style.width') get width() {
    return this.seat.width + '%';
  }

  @HostBinding('style.height') get height() {
    return this.seat.height + '%';
  }

  @HostBinding('style.border-radius') get rounded() {
    return this.seat.rounded + '%';
  }

  ngOnInit(): void {
    this.status = 'leave';
    // this.status = this.seat.status ? this.seat.status.toLowerCase().replace('/', '-').split(' ').join('-') : '';
  }

  onDelete(): void {
    this.delete.emit();
  }

  viewDetail(): void {
    this.router.navigate(['/human-resource/employees', this.seat.id]);
  }
}
