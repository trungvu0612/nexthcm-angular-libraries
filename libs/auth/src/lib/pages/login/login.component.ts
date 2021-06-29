import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { LoginPayload } from '../../models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'hcm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm = this.fb.group<LoginPayload>({} as LoginPayload);
  model = {} as LoginPayload;
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

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(() => this.router.navigateByUrl('/'));
    }
  }
}
