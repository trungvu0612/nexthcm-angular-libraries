import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  GetChatRoomDetailQuery,
  GetChatRoomDetailQueryService,
  GetFirstRoomQueryService,
} from '../../services/chat.service';

interface ComponentState {
  detail: GetChatRoomDetailQuery['chatRoomDetail'];
}

@Component({
  selector: 'hcm-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class ChatRoomComponent {
  roomId$: Observable<string> = this.activatedRoute.params.pipe(
    tap((res) => console.log(res)),
    map((params) => params.roomId),
    filter(isPresent),
  );
  limit$ = new BehaviorSubject<number>(20);
  getChatRoomDetail$ = combineLatest([this.roomId$, this.limit$]).pipe(
    switchMap(([roomId, limit]) => this.getChatRoomDetailQueryService.watch({ roomId, limit }).valueChanges),
    map(({ data }) => data.chatRoomDetail),
  );
  data$ = this.state.select('detail');

  constructor(
    getFirstRoomQueryService: GetFirstRoomQueryService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private destroy$: TuiDestroyService,
    private state: RxState<ComponentState>,
    private authService: AuthService,
    private getChatRoomDetailQueryService: GetChatRoomDetailQueryService
  ) {
    if (!activatedRoute.snapshot.params.roomId) {
      getFirstRoomQueryService
        .fetch()
        .pipe(
          map((res) => res.data.chatRooms[0]?.roomId),
          filter(isPresent),
          takeUntil(destroy$)
        )
        .subscribe((roomId) => router.navigate(['/chat', roomId]));
    }

    this.state.connect('detail', this.getChatRoomDetail$);
  }
}
