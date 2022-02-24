import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { EmployeeEducation } from '../../../models';
import { ProfileEducationStore } from './profile-education.store';

@Injectable({ providedIn: 'root' })
export class ProfileEducationQuery extends Query<EmployeeEducation> {
  constructor(protected store: ProfileEducationStore) {
    super(store);
  }
}
