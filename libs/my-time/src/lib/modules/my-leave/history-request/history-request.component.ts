import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyTimeService } from '../../../services/my-time.service';

@Component({
  selector: 'hcm-history-request',
  templateUrl: './history-request.component.html',
  styleUrls: ['./history-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryRequestComponent implements OnInit {
  constructor(private MyTmeService: MyTimeService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.route.snapshot.params.id) {
      this.MyTmeService.getTrackingHistory(this.route.snapshot.params.id).subscribe((item) => {
        console.log(item);
      });
    }
  }
}
