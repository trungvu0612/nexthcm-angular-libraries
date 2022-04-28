import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-portal-layout',
  templateUrl: './portal-layout.component.html',
  styleUrls: ['./portal-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalLayoutComponent {}
