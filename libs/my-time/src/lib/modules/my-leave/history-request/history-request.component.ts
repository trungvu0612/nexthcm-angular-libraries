import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyTimeService } from '../../../services/my-time.service';
import { map, share, tap } from 'rxjs/operators';
import { TrackingHistoryChanges } from '../../../models/tracking-history';

@Component({
  selector: 'hcm-history-request',
  templateUrl: './history-request.component.html',
  styleUrls: ['./history-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryRequestComponent implements OnInit {
  private readonly request$ = this.myTimeService.getTrackingHistory(this.route.snapshot.params.id).pipe(share());
  data$ = this.request$.pipe(
    map((histories) =>
      ([] as TrackingHistoryChanges[]).concat(
        ...histories.map((history) => history.changes.filter((change) => change.changeType === 'ValueChange'))
      )
    ),
    tap((res) => console.log(res))
  );

  loading$ = this.request$.pipe(map(value => !value));

  constructor(private myTimeService: MyTimeService, private route: ActivatedRoute) {}

  ngOnInit(): void {}
}
