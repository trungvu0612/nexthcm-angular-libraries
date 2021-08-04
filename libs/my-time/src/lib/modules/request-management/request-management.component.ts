import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-request-management',
  templateUrl: './request-management.component.html',
  styleUrls: ['./request-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestManagementComponent {
  activeItemIndex = 0;
}
