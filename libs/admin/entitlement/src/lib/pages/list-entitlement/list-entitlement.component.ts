import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-list-entitlement',
  templateUrl: './list-entitlement.component.html',
  styleUrls: ['./list-entitlement.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListEntitlementComponent {
  activeItemIndex = 0;
}
