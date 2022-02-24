import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { EmployeeGeneralInformation } from '../../../models';
import { ProfileGeneralStore } from './profile-general.store';

@Injectable({ providedIn: 'root' })
export class ProfileGeneralQuery extends Query<EmployeeGeneralInformation> {
  constructor(protected store: ProfileGeneralStore) {
    super(store);
  }
}
