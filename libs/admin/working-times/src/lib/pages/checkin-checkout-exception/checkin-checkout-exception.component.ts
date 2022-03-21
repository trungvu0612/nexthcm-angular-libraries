import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  selector: 'hcm-checkin-checkout-exclusion',
  templateUrl: './checkin-checkout-exception.component.html',
  styleUrls: ['./checkin-checkout-exception.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckinCheckoutExceptionComponent {
  activeItemIndex = 0;

  constructor(@Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope) {}
}
