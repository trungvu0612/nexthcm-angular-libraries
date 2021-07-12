import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-admin-departments',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDepartmentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
