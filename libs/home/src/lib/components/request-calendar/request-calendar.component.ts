import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-request-calendar',
  templateUrl: './request-calendar.component.html',
  styleUrls: ['./request-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestCalendarComponent {
  activeItemIndex = 0;
}
