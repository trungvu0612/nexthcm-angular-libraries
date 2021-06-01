import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { RepeatCalendarCustomComponent } from './repeat-calendar-custom/repeat-calendar-custom.component';

@Component({
  selector: 'hcm-formly-repeat-event-calendar',
  templateUrl: './formly-repeat-event-calendar.component.html',
  styleUrls: ['./formly-repeat-event-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyRepeatEventCalendarComponent implements OnInit {
  showDropdown = true;
  open = false;
  childOpen = true;
  readonly items = [['Never', 'Daily', 'Weekly on Wednesday', 'Monthly on the second Wednesday', 'Annually on Sep 11']];
  primary = 'Never';

  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  onClick(item: string) {
    this.showDropdown = !this.showDropdown;
    if (this.items[0].indexOf(item) !== -1) {
      this.primary = item;
      return;
    }
  }

  repeatModal() {
    this.showDropdown = !this.showDropdown;
    this.dialogService
      .open(new PolymorpheusComponent(RepeatCalendarCustomComponent, this.injector), {
        size: 'm',
        closeable: false,
      })
      .subscribe((map) => {
        this.changeDetector.detectChanges();
      });
  }
}
