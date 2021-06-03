import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hcm-admin-menu-left',
  templateUrl: './admin-menu-left.component.html',
  styleUrls: ['./admin-menu-left.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminMenuLeftComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
