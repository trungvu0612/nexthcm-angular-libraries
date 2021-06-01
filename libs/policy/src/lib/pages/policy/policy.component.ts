import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Policy } from '../../models/policy';

@Component({
  selector: 'hcm-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyComponent {
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
}
