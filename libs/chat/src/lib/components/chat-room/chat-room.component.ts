import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { filter, map, takeUntil } from 'rxjs/operators';
import { GetFirstRoomQueryService } from '../../services/chat.service';

@Component({
  selector: 'hcm-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class ChatRoomComponent {
  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    getFirstRoomQueryService: GetFirstRoomQueryService,
    private destroy$: TuiDestroyService
  ) {
    if (!activatedRoute.snapshot.params.roomId) {
      getFirstRoomQueryService
        .fetch()
        .pipe(
          map((res) => res.data.chatRooms[0]?.roomId),
          filter(isPresent),
          takeUntil(this.destroy$)
        )
        .subscribe((roomId) => router.navigate(['/chat', roomId]));
    }
  }
}
