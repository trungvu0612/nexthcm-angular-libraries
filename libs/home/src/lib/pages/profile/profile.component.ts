import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserProfileService } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly profile$ = this.userProfileState.select('general');
  readonly isBirthday$ = this.userProfileState.isBirthday$;
  activeItemIndex = 0;

  constructor(private readonly userProfileState: UserProfileService) {}
}
