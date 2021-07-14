import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Zone } from '@nexthcm/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { WorkingHourService } from '../../services/working-hour.service';

@Component({
  selector: 'hcm-working-hour-detail',
  templateUrl: './working-hour-detail.component.html',
  styleUrls: ['./working-hour-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkingHourDetailComponent implements OnInit {
  id = this.context.data || '';
  workingData: any;

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private context: TuiDialogContext<Partial<Zone> | null, Partial<Zone> | null>,
    private workingHourService: WorkingHourService
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.workingHourService.getWorkingHourDetail(this.id).subscribe((item) => {
        this.workingData = item;
        console.log(this.workingData);
      });
    }
  }
}
