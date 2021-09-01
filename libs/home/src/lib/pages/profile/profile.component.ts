import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { loadProfileIndividualInformation, ProfileGeneralQuery, ProfileIndividualQuery } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  activeItemIndex = 0;
  readonly profile$ = this.profileGeneralQuery.select();
  readonly isBirthday$ = this.profileIndividualQuery.isBirthday$;

  constructor(
    private readonly profileGeneralQuery: ProfileGeneralQuery,
    private readonly profileIndividualQuery: ProfileIndividualQuery,
    private readonly actions: Actions
  ) {
    this.actions.dispatch(loadProfileIndividualInformation());
  }
}
