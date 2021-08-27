import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserProfileStore } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile-shui',
  templateUrl: './profile-shui.component.html',
  styleUrls: ['./profile-shui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileShuiComponent {
  readonly profile$ = this.userProfileStore.select('shui');

  constructor(private readonly userProfileStore: UserProfileStore) {}
}
