import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

interface User {
  readonly name: string;
  readonly email: string;
  readonly status: 'alive' | 'deceased';
  readonly tags: readonly string[];
}

@Component({
  selector: 'hcm-list-leave-type',
  templateUrl: './list-leave-type.component.html',
  styleUrls: ['./list-leave-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListLeaveTypeComponent implements OnInit {


  constructor() {
  }

  ngOnInit(): void {
  }
  readonly columns = ['name', 'email', 'status', 'tags', 'actions'];

  users: readonly User[] = [
    {
      name: 'Michael Palin',
      email: 'm.palin@montypython.com',
      status: 'alive',
      tags: ['Funny'],
    },
    {
      name: 'Eric Idle',
      email: 'e.idle@montypython.com',
      status: 'alive',
      tags: ['Funny', 'Music'],
    },
    {
      name: 'John Cleese',
      email: 'j.cleese@montypython.com',
      status: 'alive',
      tags: ['Funny', 'Tall', 'Actor'],
    },
    {
      name: 'Terry Jones',
      email: '',
      status: 'deceased',
      tags: ['Funny', 'Director'],
    },
    {
      name: 'Terry Gilliam',
      email: 't.gilliam@montypython.com',
      status: 'alive',
      tags: ['Funny', 'Director'],
    },
    {
      name: 'Graham Chapman',
      email: '',
      status: 'deceased',
      tags: ['Funny', 'King Arthur'],
    },
  ];

  remove(item: User) {
    this.users = this.users.filter(user => user !== item);
  }

  length = 64;

  index = 10;

  goToPage(index: number) {
    this.index = index;
    console.log('New page:', index);
  }



}
