import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { filter, map, takeUntil } from 'rxjs/operators';
import { GetFirstRoomQueryService } from './services/chat.service';

@Component({
  selector: 'hcm-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ChatComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private getFirstRoomQueryService: GetFirstRoomQueryService,
    private router: Router,
    private destroy$: TuiDestroyService
  ) {
    if (!this.activatedRoute.firstChild) {
      this.getFirstRoomQueryService
        .fetch()
        .pipe(
          map(({ data }) => data.chatRooms[0]?.roomId),
          filter(isPresent),
          takeUntil(this.destroy$)
        )
        .subscribe((roomId) => this.router.navigate(['/chat', roomId]));
    }
  }
}
