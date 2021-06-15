import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SeatZone } from '../../models/offices';

@Component({
  selector: 'hcm-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {
  @Input() title!: string;
  @Input() columns!: string[];
  @Input() data!: Partial<SeatZone>[];
  @Output() add = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() remove = new EventEmitter();
  page = 0;
  size = 10;

  get dataPerPage(): Partial<SeatZone>[] {
    return this.data.slice(this.page * this.size, (this.page + 1) * this.size);
  }
}
