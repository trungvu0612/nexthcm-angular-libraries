import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Node } from '../../models/node';

@Component({
  selector: 'hcm-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgChartComponent implements OnInit {
  jsonRes: Node[] = [
    {
      id: 1,
      name: 'Vien Nguyen',
      job: 'general manager',
      img: 'assets/images/noti.png',
      children: [
        {
          id: 2,
          name: 'Son Nguyen',
          job: 'department manager',
          img: 'assets/images/noti.png',
          children: [
            { id: 3, name: 'Long Le Luoi', job: 'Linh danh thue', img: 'assets/images/noti.png' },
            { id: 4, name: 'Tin Khoc Nhe', job: 'Linh danh thue', img: 'assets/images/noti.png' },
            { id: 5, name: 'Luong Leo Cong Nha', job: 'Linh danh thue ', img: 'assets/images/noti.png' },
          ],
        },
      ],
    },
  ];

  items: any[] = [
    { id: 1, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: '' },
    { id: 2, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: '' },
    { id: 3, name: 'Le Hong Phuc', job: 'Chief Executive Officer (CEO)', img: '' },
    { id: 4, name: 'Nam Nhat', job: 'Chief Executive Officer (CEO)', img: '' },
    { id: 5, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: '' },
    { id: 6, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: '' },
    { id: 7, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: '' },
    { id: 8, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: '' },

    { id: 1, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 2, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 3, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 4, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 5, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 6, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 7, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 8, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },

    { id: 1, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 2, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 3, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 4, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 5, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 6, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 7, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 8, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },

    { id: 1, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 2, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 3, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 4, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 5, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 6, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 7, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 8, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },

    { id: 1, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 2, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
    { id: 3, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
  ];

  itemLeaders: any[] = [
    { id: 1, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
  ];

  itemCEOs: any[] = [
    { id: 1, name: 'Vincent Nguyen', job: 'Chief Executive Officer (CEO)', img: 'assets/images/noti.png' },
  ];

  arrayCEOs: Node[] = [];
  arrayManagers: Node[] = [];
  arrayEmployees: Node[] = [];

  constructor() {}

  ngOnInit(): void {
    this.getTest();
  }

  getTest(): void {
    console.log('::::cap 0::::::::::::::::::', this.jsonRes.length);
    this.arrayCEOs.push(this.jsonRes[0]);
    console.log('::::Result cap 0::::::::::::::::::', this.arrayCEOs);
    for (const a of this.jsonRes) {
      console.log('::::cap 1::::::::::::::::::', a.children?.length);
      if (a.children != null) {
        this.arrayManagers.push(a.children[0]);
      }
      console.log('::::Result cap 1::::::::::::::::::', this.arrayManagers);
      if (a.children?.length != undefined) {
        for (const b of a.children) {
          console.log('::::cap 2::::::::::::::::::', b.children?.length);
          if (b.children != null) {
            for (const c of b.children) {
              this.arrayEmployees.push(c);
            }
            console.log('::::Result cap 2::::::::::::::::::', this.arrayEmployees);
          }
        }
      }
    }
  }
  //test 3 - leve linh danh thue

  //test 2 - level a Son

  //nhung cai con lai , hien tai chi co 2 cai tren thoi
}
