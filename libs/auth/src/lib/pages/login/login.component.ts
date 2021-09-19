import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly translocoService: TranslocoService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // reset login status
    this.authService.logout();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/';
  }

  onSubmit(): void {
    this.loginForm.controls.password.setErrors(null);
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value)
        .pipe(
          catchError(() => {
            this.loginForm.controls.password.setErrors({ invalidCredential: true });
            return EMPTY;
          })
        )
        .subscribe(() => this.router.navigateByUrl(this.returnUrl));
    }
  }
}
