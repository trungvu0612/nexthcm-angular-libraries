import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProfileIndividualQuery } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-profile-individual',
  templateUrl: './profile-individual.component.html',
  styleUrls: ['./profile-individual.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileIndividualComponent {
  readonly profile$ = this.profileIndividualQuery.select();
  readonly isBirthday$ = this.profileIndividualQuery.isBirthday$;

  constructor(private readonly profileIndividualQuery: ProfileIndividualQuery) {}
}
