import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hcm-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
