import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
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

  numberOfSlides!: number;

  @HostListener('window:resize', ['$event.target.innerWidth'])
  sizeChange(screenWidth: number) {
    if (screenWidth > 1630) {
      this.numberOfSlides = 5;
    } else if (screenWidth > 1410) {
      this.numberOfSlides = 4;
    } else if (screenWidth > 1180) {
      this.numberOfSlides = 3;
    } else {
      this.numberOfSlides = 2;
    }
  }

  ngOnInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
