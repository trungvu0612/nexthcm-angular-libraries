import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hcm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(router: Router) {
    router.initialNavigation();
  }
}
