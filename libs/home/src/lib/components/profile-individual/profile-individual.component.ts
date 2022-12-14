import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserProfileService } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile-individual',
  templateUrl: './profile-individual.component.html',
  styleUrls: ['./profile-individual.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileIndividualComponent {
  readonly profile$ = this.userProfileService.individual$;
  readonly isBirthday$ = this.userProfileService.isBirthday$;

  constructor(private readonly userProfileService: UserProfileService) {
    userProfileService.doLoadIndividualInformation();
  }
}
