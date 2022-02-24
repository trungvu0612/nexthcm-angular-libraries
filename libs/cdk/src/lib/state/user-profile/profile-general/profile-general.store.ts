import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

import { EmployeeGeneralInformation } from '../../../models';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'profile-general' })
export class ProfileGeneralStore extends Store<EmployeeGeneralInformation> {
  constructor() {
    super({});
  }
}
