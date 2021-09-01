import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { loadProfileSHUIInformation, ProfileSHUIQuery } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile-shui',
  templateUrl: './profile-shui.component.html',
  styleUrls: ['./profile-shui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileShuiComponent {
  readonly profile$ = this.profileSHUIQuery.select();

  constructor(private readonly profileSHUIQuery: ProfileSHUIQuery, private readonly actions: Actions) {
    this.actions.dispatch(loadProfileSHUIInformation());
  }
}
