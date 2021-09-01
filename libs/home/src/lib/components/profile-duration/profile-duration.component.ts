import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { loadProfileDurationInformation, ProfileDurationQuery } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile-duration',
  templateUrl: './profile-duration.component.html',
  styleUrls: ['./profile-duration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDurationComponent {
  readonly profile$ = this.profileDurationQuery.select();

  constructor(private readonly profileDurationQuery: ProfileDurationQuery, private readonly actions: Actions) {
    this.actions.dispatch(loadProfileDurationInformation());
  }
}
