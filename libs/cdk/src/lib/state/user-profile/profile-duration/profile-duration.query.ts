import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { EmployeeDuration } from '../../../models';
import { ProfileDurationStore } from './profile-duration.store';

@Injectable({ providedIn: 'root' })
export class ProfileDurationQuery extends Query<EmployeeDuration> {
  constructor(protected store: ProfileDurationStore) {
    super(store);
  }
}
