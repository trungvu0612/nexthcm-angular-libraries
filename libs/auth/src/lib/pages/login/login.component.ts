import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { of, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'hcm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  readonly form = new UntypedFormGroup({});
  readonly model = {};
  readonly fields = [
    {
      key: 'username',
      type: 'input',
      templateOptions: {
        translate: true,
        required: true,
        label: 'username',
        exampleText: this.translocoScope.scope + '.enterUsername',
        textfieldLabelOutside: true,
        labelClassName: 'font-semibold',
      },
    },
    {
      className: 'block mt-5',
      key: 'password',
      type: 'input-password',
      templateOptions: {
        translate: true,
        required: true,
        label: `${this.translocoScope.scope}.password`,
        exampleText: this.translocoScope.scope + '.enterPassword',
        textfieldLabelOutside: true,
        labelClassName: 'font-semibold',
      },
      validation: {
        messages: {
          invalidCredential: () => this.translocoService.translate(this.translocoScope.scope + '.invalidCredential'),
          serverNotResponding: () =>
            this.translocoService.translate(this.translocoScope.scope + '.serverNotResponding'),
        },
      },
    },
    {
      className: 'block mt-5',
      key: 'rememberMe',
      type: 'checkbox-labeled',
      defaultValue: false,
      templateOptions: {
        translate: true,
        label: `${this.translocoScope.scope}.rememberMe`,
        labelClassName: 'font-semibold',
      },
    },
  ];
  readonly login$ = new Subject<void>();
  readonly loading$ = this.login$.pipe(
    switchMap(() =>
      this.authService.login(this.form.value).pipe(
        tap(() => this.router.navigateByUrl(this.returnUrl)),
        catchError(({ status }) => {
          this.form.controls['password'].setErrors(
            status === 401 ? { invalidCredential: true } : { serverNotResponding: true }
          );
          return of(true);
        }),
        startWith(false)
      )
    ),
    map((value) => !value)
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly authService: AuthService,
    private readonly translocoService: TranslocoService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
    this.authService.logout();
  }

  submit(): void {
    this.form.controls['password'].setErrors(null);
    if (this.form.valid) this.login$.next();
  }
}
