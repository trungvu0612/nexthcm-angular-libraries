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
import { SeatInfo } from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'hcm-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatComponent implements OnInit {
  @Input() seat!: SeatInfo;
  @Input() dimension!: number[];
  @Input() rounded!: number;
  @Output() delete = new EventEmitter();
  isAdmin = true;
  status!: string;

  constructor(public elementRef: ElementRef, private router: Router) {}

  @HostBinding('style.left') get left() {
    return this.seat.positionX + '%';
  }

  @HostBinding('style.top') get top() {
    return this.seat.positionY + '%';
  }

  @HostBinding('style.width') get width() {
    return this.dimension[0] + '%';
  }

  @HostBinding('style.height') get height() {
    return this.dimension[1] + '%';
  }

  ngOnInit(): void {
    this.status = this.seat.status ? this.seat.status.toLowerCase().replace('/', '-').split(' ').join('-') : '';
  }

  onDelete(): void {
    this.delete.emit();
  }

  viewDetail(): void {
    this.router.navigate(['/human-resource/employees', this.seat.id]);
  }
}
