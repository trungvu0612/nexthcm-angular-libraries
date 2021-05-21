import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { RequestOtComponent } from '../../components/request-ot/request-ot.component';
import { WorkingOutsiteComponent } from '../../components/working-outsite/working-outsite.component';

@Component({
  selector: 'hcm-working-hour',
  templateUrl: './working-hour.component.html',
  styleUrls: ['./working-hour.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkingHourComponent implements OnInit {
  workingMeStatus = true;

  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  workingStatus(type: string) {
    if (type == 'me') {
      this.workingMeStatus = true;
    }
    if (type == 'all') {
      this.workingMeStatus = false;
    }
  }

  requestOT(): void {
    this.dialogService
      .open(new PolymorpheusComponent(RequestOtComponent, this.injector), {
        size: 'm',
        closeable: false,
      })
      .subscribe((map) => {
        this.changeDetector.detectChanges();
      });
  }

  workingOutsite(): void {
    this.dialogService
      .open(new PolymorpheusComponent(WorkingOutsiteComponent, this.injector), {
        size: 'm',
        closeable: false,
      })
      .subscribe((map) => {
        this.changeDetector.detectChanges();
      });
  }
}
