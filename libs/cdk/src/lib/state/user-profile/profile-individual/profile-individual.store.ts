import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

import { EmployeeIndividual } from '../../../models';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'profile-individual' })
export class ProfileIndividualStore extends Store<EmployeeIndividual> {
  constructor() {
    super({});
  }
}
