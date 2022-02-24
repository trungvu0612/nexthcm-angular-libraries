import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

import { EmployeeSHUI } from '../../../models';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'profile-shui' })
export class ProfileSHUIStore extends Store<EmployeeSHUI> {
  constructor() {
    super({});
  }
}
