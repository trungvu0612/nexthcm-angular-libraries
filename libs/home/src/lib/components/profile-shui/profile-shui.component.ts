import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserProfileService } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile-shui',
  templateUrl: './profile-shui.component.html',
  styleUrls: ['./profile-shui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileShuiComponent {
  readonly profile$ = this.userProfileState.select('shui');

  constructor(private readonly userProfileState: UserProfileService) {}
}
