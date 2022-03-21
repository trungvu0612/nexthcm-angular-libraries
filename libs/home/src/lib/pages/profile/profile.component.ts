import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserProfileService } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  activeItemIndex = 0;
  readonly profile$ = this.userProfileService.general$;
  readonly isBirthday$ = this.userProfileService.isBirthday$;

  constructor(private readonly userProfileService: UserProfileService) {
    userProfileService.doLoadGeneralInformation();
    userProfileService.doLoadIndividualInformation();
  }
}
