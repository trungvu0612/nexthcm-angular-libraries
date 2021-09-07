import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-email-template-management',
  templateUrl: './email-template-management.component.html',
  styleUrls: ['./email-template-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailTemplateManagementComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
