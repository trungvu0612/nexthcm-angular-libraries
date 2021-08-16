import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LetModule } from '@rx-angular/template';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { ChatComponent } from './chat.component';
import { ChatRoomListComponent } from './components/chat-room-list/chat-room-list.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { GraphqlModule } from './graphql/graphql.module';

export const CHAT_ROUTES: Routes = [
  {
    path: '',
    component: ChatComponent,
    children: [{ path: ':roomId', component: ChatRoomComponent }],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(CHAT_ROUTES), TuiButtonModule, LetModule, TuiSvgModule, GraphqlModule],
  declarations: [ChatComponent, ChatRoomListComponent, ChatRoomComponent],
})
export class ChatModule {}
