import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'hcm-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {
  @Input() title = '';
}
