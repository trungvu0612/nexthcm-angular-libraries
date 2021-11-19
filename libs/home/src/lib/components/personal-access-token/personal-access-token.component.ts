import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmployeesService, PromptService } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { endWith, from, mapTo, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'hcm-personal-access-token',
  templateUrl: './personal-access-token.component.html',
  styleUrls: ['./personal-access-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class PersonalAccessTokenComponent {
  readonly generateToken$ = new Subject<void>();
  readonly generateTokenHandler$ = this.generateToken$.pipe(
    switchMap(() =>
      this.employeesService.getPersonalAccessToken().pipe(
        map((token) => ({ token })),
        startWith({ isLoading: true }),
        endWith({ isLoading: false }),
        catchError((err) =>
          from(
            this.promptService.open({
              icon: 'error',
              html: this.promptService.generateErrorMessage(err),
            })
          ).pipe(mapTo({ isLoading: false }))
        )
      )
    )
  );
  readonly token$ = this.state.select('token');
  readonly isLoading$ = this.state.select('isLoading');

  constructor(
    private readonly employeesService: EmployeesService,
    private readonly state: RxState<{ token: string; isLoading: boolean }>,
    private readonly promptService: PromptService
  ) {
    state.connect(this.generateTokenHandler$);
  }
}
