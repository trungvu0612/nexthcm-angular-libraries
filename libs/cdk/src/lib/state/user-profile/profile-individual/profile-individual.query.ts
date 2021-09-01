import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { isSameDay, isSameMonth } from 'date-fns';
import { map } from 'rxjs/operators';
import { EmployeeIndividual } from '../../../models';
import { ProfileIndividualStore } from './profile-individual.store';

@Injectable({ providedIn: 'root' })
export class ProfileIndividualQuery extends Query<EmployeeIndividual> {
  readonly isBirthday$ = this.select('birthDate').pipe(
    map((dateOfBirth) => {
      const now = new Date();
      const birthDate = new Date(dateOfBirth as string);
      return isSameDay(now, birthDate) && isSameMonth(now, birthDate);
    })
  );

  constructor(protected store: ProfileIndividualStore) {
    super(store);
  }
}
