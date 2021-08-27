import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserProfileStore } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile-duration',
  templateUrl: './profile-duration.component.html',
  styleUrls: ['./profile-duration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDurationComponent {
  readonly profile$ = this.userProfileStore.select('duration');

  constructor(private readonly userProfileStore: UserProfileStore) {}
}
