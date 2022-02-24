import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

import { EmployeeDuration } from '../../../models';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'profile-duration' })
export class ProfileDurationStore extends Store<EmployeeDuration> {
  constructor() {
    super({});
  }
}
