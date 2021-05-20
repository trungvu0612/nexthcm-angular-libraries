import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'hcm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  readonly loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    remember: new FormControl(false)
  });

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;
      this.authService.login(userData).subscribe((data) => {
        if (data?.access_token) {
          this.router.navigateByUrl('/');
        }
      });
    }
  }
}
