import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { EmployeeSHUI } from '../../../models';
import { ProfileSHUIStore } from './profile-shui.store';

@Injectable({ providedIn: 'root' })
export class ProfileSHUIQuery extends Query<EmployeeSHUI> {
  constructor(protected store: ProfileSHUIStore) {
    super(store);
  }
}
