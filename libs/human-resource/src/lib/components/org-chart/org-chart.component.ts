import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgChartComponent implements OnInit {
  items: any[] = [
    {id: 1, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)'},
    {id: 2, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', },
    {id: 3, name: 'Le Hong Phuc', job: 'Chief Executive Officer (CEO)', },
    {id: 4, name: 'Nam Nhat', job: 'Chief Executive Officer (CEO)', },
    {id: 5, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', },
    {id: 6, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', },
    {id: 7, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', },
    {id: 8, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', },

    {id: 1, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 2, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 3, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 4, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 5, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 6, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 7, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 8, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},

    {id: 1, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 2, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 3, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 4, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 5, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 6, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 7, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 8, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},

    {id: 1, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 2, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 3, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 4, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 5, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 6, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 7, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 8, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},

    {id: 1, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 2, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
    {id: 3, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},

  ]

  itemLeaders: any[] = [
    {id: 1, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
  ]

  itemCEOs: any[] = [
    {id: 1, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png'},
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
