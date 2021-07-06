import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { RxState } from '@rx-angular/state';
import { map, switchMap } from 'rxjs/operators';
import { ChatRoom } from '../../models/chat-room';
import { GetRoomListQueryService } from '../../services/chat.service';

interface ComponentState {
  chatRooms: ChatRoom[];
}

@Component({
  selector: 'hcm-chat-room-list',
  templateUrl: './chat-room-list.component.html',
  styleUrls: ['./chat-room-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class ChatRoomListComponent {
  readonly userId$ = this.authService.select('userInfo', 'userId');
  readonly getChatRooms$ = this.userId$.pipe(
    switchMap((userId) =>
      this.getRoomListQueryService.watch({ userId }, { fetchPolicy: 'no-cache' }).valueChanges.pipe(
        map((res) =>
          res.data.chatRooms.map((room: ChatRoom) => {
            room.seen =
              room.currentUser[0]?.lastRead && room.lastMessageTime
                ? new Date(room.currentUser[0]?.lastRead) >= new Date(room.lastMessageTime)
                : false;
            return room;
          })
        )
      )
    )
  );
  readonly chatRooms$ = this.state.select('chatRooms');

  constructor(
    private state: RxState<ComponentState>,
    private authService: AuthService,
    private getRoomListQueryService: GetRoomListQueryService
  ) {
    this.state.connect('chatRooms', this.getChatRooms$);
  }
}
