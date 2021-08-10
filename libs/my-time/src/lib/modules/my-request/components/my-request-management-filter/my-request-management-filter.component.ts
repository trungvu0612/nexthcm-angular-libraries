import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-my-request-management-filter',
  templateUrl: './my-request-management-filter.component.html',
  styleUrls: ['./my-request-management-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyRequestManagementFilterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
