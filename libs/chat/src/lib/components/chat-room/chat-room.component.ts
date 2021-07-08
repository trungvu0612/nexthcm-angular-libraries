import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { GetChatRoomDetailQuery, GetChatRoomDetailQueryService } from '../../services/chat.service';

interface ComponentState {
  detail: GetChatRoomDetailQuery['chatRoomDetail'];
}

@Component({
  selector: 'hcm-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class ChatRoomComponent {
  readonly loggedInUserId = this.authService.get('userInfo', 'userId');
  readonly roomId$: Observable<string> = this.activatedRoute.params.pipe(
    map((params) => params.roomId),
    filter(isPresent)
  );
  limit$ = new BehaviorSubject<number>(30);
  readonly getChatRoomDetail$ = combineLatest([this.roomId$, this.limit$]).pipe(
    switchMap(([roomId, limit]) => this.getChatRoomDetailQueryService.watch({ roomId, limit }).valueChanges),
    map(({ data }) => data.chatRoomDetail),
  );
  data$ = this.state.select('detail');

  constructor(
    private activatedRoute: ActivatedRoute,
    private state: RxState<ComponentState>,
    private authService: AuthService,
    private getChatRoomDetailQueryService: GetChatRoomDetailQueryService
  ) {
    this.state.connect('detail', this.getChatRoomDetail$);
  }
}
