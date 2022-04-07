import { Component } from '@angular/core';
import { UserProfileService } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile-experience',
  templateUrl: './profile-experience.component.html',
  styleUrls: ['./profile-experience.component.scss'],
})
export class ProfileExperienceComponent {
  readonly profile$ = this.userProfileService.experience$;

  constructor(private readonly userProfileService: UserProfileService) {
    userProfileService.doLoadExperienceInformation();
  }
}
