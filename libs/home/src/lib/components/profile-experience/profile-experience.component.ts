import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserProfileService } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile-experience',
  templateUrl: './profile-experience.component.html',
  styleUrls: ['./profile-experience.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileExperienceComponent {
  readonly profile$ = this.userProfileService.experience$;

  constructor(private readonly userProfileService: UserProfileService) {
    userProfileService.doLoadExperienceInformation();
  }
}
