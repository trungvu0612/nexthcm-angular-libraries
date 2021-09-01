import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { AuthService } from '@nexthcm/auth';
import { switchMap, tap } from 'rxjs/operators';
import { EmployeesService } from '../../services';
import { ProfileDurationStore } from './profile-duration';
import { ProfileEducationStore } from './profile-education';
import { ProfileGeneralStore } from './profile-general';
import { ProfileIndividualStore } from './profile-individual';
import { ProfileSHUIStore } from './profile-shui';
import {
  loadProfileDurationInformation,
  loadProfileEducationInformation,
  loadProfileGeneralInformation,
  loadProfileIndividualInformation,
  loadProfileSHUIInformation,
} from './user-profile.actions';

@Injectable()
export class UserProfileEffects {
  @Effect()
  loadProfileGeneralInformation$ = this.actions$.pipe(
    ofType(loadProfileGeneralInformation),
    switchMap(() =>
      cacheable(
        this.profileGeneralStore,
        this.employeesService.getEmployeeGeneralInformation(this.authService.userId()).pipe(
          tap((res) => {
            this.profileGeneralStore.update(res);
            this.profileGeneralStore.setHasCache(true);
          })
        )
      )
    )
  );
  @Effect()
  loadProfileIndividualInformation$ = this.actions$.pipe(
    ofType(loadProfileIndividualInformation),
    switchMap(() =>
      cacheable(
        this.profileIndividualStore,
        this.employeesService.getEmployeeInformation(this.authService.userId(), 'individual').pipe(
          tap((res) => {
            this.profileIndividualStore.update(res);
            this.profileIndividualStore.setHasCache(true);
          })
        )
      )
    )
  );
  @Effect()
  loadProfileDurationInformation$ = this.actions$.pipe(
    ofType(loadProfileDurationInformation),
    switchMap(() =>
      cacheable(
        this.profileDurationStore,
        this.employeesService.getEmployeeInformation(this.authService.userId(), 'duration').pipe(
          tap((res) => {
            this.profileDurationStore.update(res);
            this.profileDurationStore.setHasCache(true);
          })
        )
      )
    )
  );
  @Effect()
  loadProfileEducationInformation$ = this.actions$.pipe(
    ofType(loadProfileEducationInformation),
    switchMap(() =>
      cacheable(
        this.profileEducationStore,
        this.employeesService.getEmployeeInformation(this.authService.userId(), 'education').pipe(
          tap((res) => {
            this.profileEducationStore.update(res);
            this.profileEducationStore.setHasCache(true);
          })
        )
      )
    )
  );
  @Effect()
  loadProfileSHUIInformation$ = this.actions$.pipe(
    ofType(loadProfileSHUIInformation),
    switchMap(() =>
      cacheable(
        this.profileSHUIStore,
        this.employeesService.getEmployeeInformation(this.authService.userId(), 'shui').pipe(
          tap((res) => {
            this.profileSHUIStore.update(res);
            this.profileSHUIStore.setHasCache(true);
          })
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly employeesService: EmployeesService,
    private readonly profileGeneralStore: ProfileGeneralStore,
    private readonly profileIndividualStore: ProfileIndividualStore,
    private readonly profileDurationStore: ProfileDurationStore,
    private readonly profileEducationStore: ProfileEducationStore,
    private readonly profileSHUIStore: ProfileSHUIStore
  ) {}
}
