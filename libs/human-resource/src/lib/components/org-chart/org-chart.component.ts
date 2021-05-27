import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OrgRes } from '../../models/node';

@Component({
  selector: 'hcm-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgChartComponent implements OnInit {
  @Input() data$!: Observable<OrgRes[]>;
  open = true;
  index = 0;

  readonly context!: { $implicit: OrgRes[] };
  readonly burgers = ['Classic', 'Cheeseburger', 'Royal Cheeseburger'];

  readonly drinks = ['Cola', 'Tea', 'Coffee', 'Slurm'];

  a$ = of([
    {
      createdDate: 1621544996921,
      lastModifiedDate: 1621544996921,
      optCounter: 0,
      id: 'e08eb04d-a430-4e03-b017-e46f865e648d',
      tenant: {
        createdDate: 1621394663216,
        createdBy: 'e202b659-743a-4bdb-97c7-be246194d07f',
        lastModifiedDate: 1621394663216,
        optCounter: 0,
        id: '352d7794-f165-4f03-97f0-ff7f3d0242e8',
        tenantCode: 'TNT-0000002',
        tenantName: 'Hieu Nguyen Company',
        state: 0,
      },
      username: 'vien.nguyen',
      registerType: 'R',
      descendants: [
        {
          createdDate: 1621545019778,
          lastModifiedDate: 1621545019778,
          optCounter: 0,
          id: '9d07f921-81c3-4c2c-a838-e279dc04a80f',
          tenant: {
            createdDate: 1621394663216,
            createdBy: 'e202b659-743a-4bdb-97c7-be246194d07f',
            lastModifiedDate: 1621394663216,
            optCounter: 0,
            id: '352d7794-f165-4f03-97f0-ff7f3d0242e8',
            tenantCode: 'TNT-0000002',
            tenantName: 'Hieu Nguyen Company',
            state: 0,
          },
          username: 'son.nguyen',
          registerType: 'R',
          descendants: [
            {
              createdDate: 1621545019805,
              lastModifiedDate: 1621545019805,
              optCounter: 0,
              id: '3452e624-ad89-411d-9118-da6aab92a176',
              tenant: {
                createdDate: 1621394663216,
                createdBy: 'e202b659-743a-4bdb-97c7-be246194d07f',
                lastModifiedDate: 1621394663216,
                optCounter: 0,
                id: '352d7794-f165-4f03-97f0-ff7f3d0242e8',
                tenantCode: 'TNT-0000002',
                tenantName: 'Hieu Nguyen Company',
                state: 0,
              },
              username: 'long.nguyen',
              registerType: 'R',
              descendants: [],
            },
            {
              createdDate: 1621545068749,
              lastModifiedDate: 1621545068749,
              optCounter: 0,
              id: '06874799-0ea6-47a1-8a87-c08daeaa4bb6',
              tenant: {
                createdDate: 1621394663216,
                createdBy: 'e202b659-743a-4bdb-97c7-be246194d07f',
                lastModifiedDate: 1621394663216,
                optCounter: 0,
                id: '352d7794-f165-4f03-97f0-ff7f3d0242e8',
                tenantCode: 'TNT-0000002',
                tenantName: 'Hieu Nguyen Company',
                state: 0,
              },
              username: 'nha.luong',
              registerType: 'R',
              descendants: [],
            },
            {
              createdDate: 1621545068749,
              lastModifiedDate: 1621545068749,
              optCounter: 0,
              id: 'b89293de-671f-403e-b2f8-3d67f84f9b77',
              tenant: {
                createdDate: 1621394663216,
                createdBy: 'e202b659-743a-4bdb-97c7-be246194d07f',
                lastModifiedDate: 1621394663216,
                optCounter: 0,
                id: '352d7794-f165-4f03-97f0-ff7f3d0242e8',
                tenantCode: 'TNT-0000002',
                tenantName: 'Hieu Nguyen Company',
                state: 0,
              },
              username: 'tin.do',
              registerType: 'R',
              descendants: [],
            },
          ],
        },
      ],
    },
  ]);

  readonly burgerss = ['Classic', 'Cheeseburger', 'Royal Cheeseburger'];

  constructor() {}

  ngOnInit(): void {}

  onClick() {
    this.open = false;
    this.index = 1;
  }
}
