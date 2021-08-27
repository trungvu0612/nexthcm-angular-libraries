import { Injectable } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { EmployeesService } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { isSameDay, isSameMonth } from 'date-fns';
import { filter, map, switchMap } from 'rxjs/operators';
import {
  EmployeeDuration,
  EmployeeEducation,
  EmployeeGeneralInformation,
  EmployeeIndividual,
  EmployeeSHUI,
} from '../../models';

interface UserProfileState {
  general: EmployeeGeneralInformation;
  individual: EmployeeIndividual;
  duration: EmployeeDuration;
  education: EmployeeEducation;
  shui: EmployeeSHUI;
}

@Injectable({ providedIn: 'root' })
export class UserProfileStore extends RxState<UserProfileState> {
  readonly userId$ = this.authService.select('userInfo', 'userId').pipe(filter((value) => !!value));
  readonly isBirthday$ = this.select('individual', 'birthDate').pipe(
    map((dateOfBirth) => {
      const now = new Date();
      const birthDate = new Date(dateOfBirth as string);
      return isSameDay(now, birthDate) && isSameMonth(now, birthDate);
    })
  );

  constructor(private readonly employeesService: EmployeesService, private readonly authService: AuthService) {
    super();
    this.connect(
      'general',
      this.userId$.pipe(switchMap((userId) => this.employeesService.getEmployeeGeneralInformation(userId)))
    );
    this.connect(
      'individual',
      this.userId$.pipe(switchMap((userId) => this.employeesService.getEmployeeInformation(userId, 'individual')))
    );
    this.connect(
      'duration',
      this.userId$.pipe(switchMap((userId) => this.employeesService.getEmployeeInformation(userId, 'duration')))
    );
    this.connect(
      'education',
      this.userId$.pipe(switchMap((userId) => this.employeesService.getEmployeeInformation(userId, 'education')))
    );
    this.connect(
      'shui',
      this.userId$.pipe(switchMap((userId) => this.employeesService.getEmployeeInformation(userId, 'shui')))
    );
  }
}
