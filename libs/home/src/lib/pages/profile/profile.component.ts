import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserProfileStore } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly profile$ = this.userProfileStore.select('general');
  readonly isBirthday$ = this.userProfileStore.isBirthday$;
  activeItemIndex = 0;

  constructor(private readonly userProfileStore: UserProfileStore) {}
}
