import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'hcm-logout',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent {
  constructor(private authService: AuthService) {
    authService.logout();
  }
}
