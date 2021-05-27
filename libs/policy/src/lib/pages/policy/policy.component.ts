import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import SwiperCore, { Pagination } from 'swiper/core';
import { Policy } from '../../models/policy';

SwiperCore.use([Pagination]);

@Component({
  selector: 'hcm-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyComponent implements OnInit {
  data: Policy[] = [
    {
      id: '123',
      title: 'Law Policy',
      image: 'https://i.imgur.com/IOpoVH4.jpg',
    },
    {
      id: '123',
      title: 'Law Policy',
      image: 'https://i.imgur.com/IOpoVH4.jpg',
    },
    {
      id: '123',
      title: 'Law Policy',
      image: 'https://i.imgur.com/IOpoVH4.jpg',
    },
    {
      id: '123',
      title: 'Law Policy',
      image: 'https://i.imgur.com/IOpoVH4.jpg',
    },
    {
      id: '123',
      title: 'Law Policy',
      image: 'https://i.imgur.com/IOpoVH4.jpg',
    },
    {
      id: '123',
      title: 'Law Policy',
      image: 'https://i.imgur.com/IOpoVH4.jpg',
    },
    {
      id: '123',
      title: 'Law Policy',
      image: 'https://i.imgur.com/IOpoVH4.jpg',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
