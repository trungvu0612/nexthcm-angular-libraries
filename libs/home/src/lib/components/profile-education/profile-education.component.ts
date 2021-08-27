import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserProfileStore } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile-education',
  templateUrl: './profile-education.component.html',
  styleUrls: ['./profile-education.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileEducationComponent {
  readonly profile$ = this.userProfileStore.select('education');

  constructor(private readonly userProfileStore: UserProfileStore) {}
}
