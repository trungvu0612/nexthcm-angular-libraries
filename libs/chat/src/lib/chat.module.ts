import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TuiButtonModule } from '@taiga-ui/core';
import { ChatComponent } from './chat.component';
import { ChatRoomListComponent } from './components/chat-room-list/chat-room-list.component';

export const chatRoutes: Routes = [
  {
    path: '',
    component: ChatComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(chatRoutes), TuiButtonModule],
  declarations: [ChatComponent, ChatRoomListComponent],
})
export class ChatModule {}
