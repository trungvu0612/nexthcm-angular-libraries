import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { EmployeeEducation } from '../../../models';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'profile-education' })
export class ProfileEducationStore extends Store<EmployeeEducation> {
  constructor() {
    super({});
  }
}
