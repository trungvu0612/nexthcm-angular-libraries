import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TuiDay } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-request-ot',
  templateUrl: './request-ot.component.html',
  styleUrls: ['./request-ot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestOtComponent implements OnInit {
  fromDate = new FormControl(new TuiDay(2021, 0, 21));
  toDate = new FormControl();
  sendTo = new FormControl();
  reason = new FormControl();
  showDropdown = true;
  open = false;
  primary = 'son.nguyen-thanh@banvien.com.vn';
  readonly sendItems = [['son.nguyen-thanh@banvien.com.vn', 'vien.nguyen-hai@banvien.com.vn']];

  constructor() {}

  ngOnInit(): void {}

  onClick(item: string) {
    this.showDropdown = !this.showDropdown;
    if (this.sendItems[0].indexOf(item) !== -1) {
      this.primary = item;
      return;
    }
  }

  submit() {}
}
