import { GetRoomListQuery } from '../services/chat.service';

type ChatRoomBase = GetRoomListQuery['chatRooms'][number];

export interface ChatRoom extends ChatRoomBase {
  seen?: boolean;
}
