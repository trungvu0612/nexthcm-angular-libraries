import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserProfileService } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile-duration',
  templateUrl: './profile-duration.component.html',
  styleUrls: ['./profile-duration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDurationComponent {
  readonly profile$ = this.userProfileState.select('duration');

  constructor(private readonly userProfileState: UserProfileService) {}
}
