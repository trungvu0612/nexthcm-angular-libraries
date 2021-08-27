import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserProfileService } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile-education',
  templateUrl: './profile-education.component.html',
  styleUrls: ['./profile-education.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileEducationComponent {
  readonly profile$ = this.userProfileState.select('education');

  constructor(private readonly userProfileState: UserProfileService) {}
}
