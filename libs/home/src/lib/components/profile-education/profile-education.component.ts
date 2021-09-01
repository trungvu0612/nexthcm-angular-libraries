import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { loadProfileEducationInformation, ProfileEducationQuery } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile-education',
  templateUrl: './profile-education.component.html',
  styleUrls: ['./profile-education.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileEducationComponent {
  readonly profile$ = this.profileEducationQuery.select();

  constructor(private readonly profileEducationQuery: ProfileEducationQuery, private readonly actions: Actions) {
    this.actions.dispatch(loadProfileEducationInformation());
  }
}
