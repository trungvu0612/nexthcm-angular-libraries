import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TuiDay } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-working-outsite',
  templateUrl: './working-outsite.component.html',
  styleUrls: ['./working-outsite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkingOutsiteComponent implements OnInit {
  fromDate = new FormControl(new TuiDay(2021, 0, 21));
  toDate = new FormControl();
  sendTo = new FormControl();
  reason = new FormControl();
  duration = new FormControl();

  sendItems = ['son.nguyen-thanh@banvien.com.vn', 'vien.nguyen-hai@banvien.com.vn'];
  durationItems = ['All day', 'Monday'];

  constructor() {}

  ngOnInit(): void {}

  submit() {}
}
