import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { GetRoomListGQL } from '../../generated/generated';

@Component({
  selector: 'hcm-chat-room-list',
  templateUrl: './chat-room-list.component.html',
  styleUrls: ['./chat-room-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatRoomListComponent implements OnInit {
  chatRooms$ = this.getRoomListGQL
    .watch({ userId: '934e5a26-8ade-4d3b-b7d9-28e11a1e4c2a' }, { fetchPolicy: 'no-cache' })
    .valueChanges.pipe(map((res) => res.data));

  constructor(private getRoomListGQL: GetRoomListGQL) {}

  ngOnInit(): void {
    this.chatRooms$.subscribe((res) => console.log(res));
  }
}
