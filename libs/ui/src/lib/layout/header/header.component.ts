import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const PATHS: { [key: string]: { [key: string]: string[] } } = {
  'my-time': {
    keys: ['leave', 'working-hour', 'request'],
    values: ['My Leave', 'Working Hour', 'My Request'],
  },
  'help-desk': {
    keys: ['seat-map', 'bv-calendar'],
    values: ['Seat Map', 'BV Calendar'],
  },
  'human-resource': {
    keys: ['chart', 'teams', 'employees'],
    values: ['Organization Chart', 'Teams', 'Employees'],
  },
  policy: {
    keys: ['policies', 'updated'],
    values: ['Policy', 'Updated'],
  },
};

@Component({
  selector: 'hcm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  urlSegments = this.router.url.split('/');
  activeItemIndex!: number;
  tabs!: string[];
  notification = 13;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.tabs = PATHS[this.urlSegments[1]].values;
    this.activeItemIndex = PATHS[this.urlSegments[1]].keys.indexOf(this.urlSegments[2]);
  }

  onChangeTab(index: number): void {
    this.urlSegments[2] = PATHS[this.urlSegments[1]].keys[index];
    this.router.navigate(this.urlSegments.slice(0, 3));
  }
}
