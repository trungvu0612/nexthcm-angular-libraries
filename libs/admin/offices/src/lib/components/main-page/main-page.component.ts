import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResponseData, Zone } from '@nexthcm/ui';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ZoneType } from '../../models/offices';
import { AdminOfficesService } from '../../services/admin-offices.service';

@Component({
  selector: 'hcm-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
  @Input() columns!: string[];
  @Input() type!: ZoneType;
  @Input() refresh$!: Subject<unknown>;
  @Output() add = new EventEmitter();
  @Output() edit = new EventEmitter<Partial<Zone>>();
  @Output() remove = new EventEmitter<Partial<Zone>>();
  params$ = new BehaviorSubject<{ page?: number; size?: number }>({ size: 10 });
  data$!: Observable<ResponseData<Zone>>;

  constructor(private adminOfficesService: AdminOfficesService) {}

  ngOnInit(): void {
    this.data$ = merge(this.refresh$, this.params$).pipe(
      switchMap(() => this.adminOfficesService.getZoneData(this.type, this.params$.value))
    );
  }

  onChange(key: 'page' | 'size', value: number): void {
    this.params$.next({ ...this.params$.value, [key]: value });
  }
}
