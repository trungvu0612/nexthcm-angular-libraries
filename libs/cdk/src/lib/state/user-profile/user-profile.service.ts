import { Injectable } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { RxState } from '@rx-angular/state';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject, tap } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
  EmployeeDuration,
  EmployeeEducation,
  EmployeeExperience,
  EmployeeGeneralInformation,
  EmployeeIndividual,
  EmployeeSHUI,
} from '../../models';
import { EmployeesService } from '../../services';

interface UserProfileState {
  general: EmployeeGeneralInformation;
  individual: EmployeeIndividual;
  duration: EmployeeDuration;
  education: EmployeeEducation;
  experience: EmployeeExperience;
  shui: EmployeeSHUI;
}

@Injectable({
  providedIn: 'root',
})
export class UserProfileService extends RxState<UserProfileState> {
  readonly general$ = this.select('general');
  readonly individual$ = this.select('individual');
  readonly duration$ = this.select('duration');
  readonly education$ = this.select('education');
  readonly experience$ = this.select('experience');
  readonly shui$ = this.select('shui');
  readonly isBirthday$ = this.select('individual', 'birthDate').pipe(
    map((dateOfBirth) => {
      const now = new Date();
      const birthDate = new Date(dateOfBirth as string);
      return isSameDay(now, birthDate) && isSameMonth(now, birthDate);
    })
  );
  private readonly loadGeneralInformation$ = new Subject<void>();
  private readonly loadIndividualInformation$ = new Subject<void>();
  private readonly loadDurationInformation$ = new Subject<void>();
  private readonly loadEducationInformation$ = new Subject<void>();
  private readonly loadExperienceInformation$ = new Subject<void>();
  private readonly loadSHUIInformation$ = new Subject<void>();

  constructor(private readonly authService: AuthService, private readonly employeesService: EmployeesService) {
    super();
    this.connect(
      'general',
      this.loadGeneralInformation$.pipe(
        switchMap(() => this.employeesService.getEmployeeGeneralInformation(this.authService.userId()))
      )
    );
    this.connect(
      'individual',
      this.loadIndividualInformation$.pipe(
        switchMap(() => this.employeesService.getEmployeeInformation(this.authService.userId(), 'INDIVIDUAL'))
      )
    );
    this.connect(
      'duration',
      this.loadDurationInformation$.pipe(
        switchMap(() => this.employeesService.getEmployeeInformation(this.authService.userId(), 'DURATION'))
      )
    );
    this.connect(
      'education',
      this.loadEducationInformation$.pipe(
        switchMap(() => this.employeesService.getEmployeeInformation(this.authService.userId(), 'EDUCATION'))
      )
    );
    this.connect(
      'experience',
      this.loadExperienceInformation$.pipe(
        switchMap(() => this.employeesService.getEmployeeInformation(this.authService.userId(), 'WORK_EXPERIENCE'))
      )
    );
    this.connect(
      'shui',
      this.loadSHUIInformation$.pipe(
        switchMap(() => this.employeesService.getEmployeeInformation(this.authService.userId(), 'SHUI'))
      )
    );
    this.hold(
      this.authService.newLogin$.pipe(
        tap(() => {
          this.doRefreshGeneralInformation();
          this.doRefreshIndividualInformation();
          this.doRefreshDurationInformation();
          this.doRefreshEducationInformation();
          this.doRefreshExperienceInformation();
          this.doRefreshSHUIInformation();
        })
      )
    );
  }

  doLoadGeneralInformation(): void {
    if (!this.get('general')) {
      this.loadGeneralInformation$.next();
    }
  }

  doLoadIndividualInformation(): void {
    if (!this.get('individual')) {
      this.loadIndividualInformation$.next();
    }
  }

  doLoadDurationInformation(): void {
    if (!this.get('duration')) {
      this.loadDurationInformation$.next();
    }
  }

  doLoadEducationInformation(): void {
    if (!this.get('education')) {
      this.loadEducationInformation$.next();
    }
  }

  doLoadExperienceInformation(): void {
    if (!this.get('education')) {
      this.loadExperienceInformation$.next();
    }
  }

  doLoadSHUIInformation(): void {
    if (!this.get('shui')) {
      this.loadSHUIInformation$.next();
    }
  }

  doRefreshGeneralInformation(): void {
    if (this.get('general')) {
      this.loadGeneralInformation$.next();
    }
  }

  doRefreshIndividualInformation(): void {
    if (this.get('individual')) {
      this.loadIndividualInformation$.next();
    }
  }

  doRefreshDurationInformation(): void {
    if (this.get('duration')) {
      this.loadDurationInformation$.next();
    }
  }

  doRefreshEducationInformation(): void {
    if (this.get('education')) {
      this.loadEducationInformation$.next();
    }
  }

  doRefreshExperienceInformation(): void {
    if (this.get('education')) {
      this.loadExperienceInformation$.next();
    }
  }

  doRefreshSHUIInformation(): void {
    if (this.get('shui')) {
      this.loadSHUIInformation$.next();
    }
  }
}
