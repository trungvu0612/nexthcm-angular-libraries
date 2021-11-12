import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, mapTo, share, startWith, switchMap, tap } from 'rxjs/operators';
import { LoginPayload } from '../../models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'hcm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group<LoginPayload>({} as LoginPayload);
  model = {} as LoginPayload;
  returnUrl!: string;
  fields: FormlyFieldConfig[] = [
    {
      key: 'username',
      type: 'input',
      templateOptions: {
        translate: true,
        required: true,
        label: 'AUTH.username',
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
        label: 'AUTH.password',
        textfieldLabelOutside: true,
        labelClassName: 'font-semibold',
      },
      validation: { messages: { invalidCredential: () => this.translocoService.translate('invalidCredential') } },
    },
    {
      className: 'block mt-5',
      key: 'rememberMe',
      type: 'checkbox-labeled',
      defaultValue: false,
      templateOptions: {
        translate: true,
        label: 'AUTH.rememberMeLabel',
        labelClassName: 'font-semibold',
      },
    },
  ];
  readonly login$ = new Subject<void>();
  readonly loginHandler$ = this.login$.pipe(
    switchMap(() => this.onLogin().pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.loginHandler$.pipe(map((value) => !value));

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly translocoService: TranslocoService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly state: RxState<Record<string, unknown>>
  ) {
    state.hold(this.loginHandler$);
  }

  ngOnInit(): void {
    // reset login status
    this.authService.logout();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/';
  }

  onLogin(): Observable<boolean> {
    return this.authService.login(this.loginForm.value).pipe(
      mapTo(true),
      tap(() => this.router.navigateByUrl(this.returnUrl)),
      catchError(() => {
        this.loginForm.controls.password.setErrors({ invalidCredential: true });
        return of(true);
      })
    );
  }

  onSubmit(): void {
    this.loginForm.controls.password.setErrors(null);
    if (this.loginForm.valid) {
      this.login$.next();
    }
  }
}
