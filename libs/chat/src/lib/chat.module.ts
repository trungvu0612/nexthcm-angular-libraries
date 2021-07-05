import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LetModule } from '@rx-angular/template';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { ChatComponent } from './chat.component';
import { ChatRoomListComponent } from './components/chat-room-list/chat-room-list.component';

export const chatRoutes: Routes = [
  {
    path: '',
    component: ChatComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(chatRoutes), TuiButtonModule, LetModule, TuiSvgModule],
  declarations: [ChatComponent, ChatRoomListComponent],
})
export class ChatModule {}
