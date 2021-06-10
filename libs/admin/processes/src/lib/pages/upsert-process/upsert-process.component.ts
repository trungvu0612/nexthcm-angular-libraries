import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { State, Transition } from '../../models/workflow';

@Component({
  selector: 'hcm-upsert-process',
  templateUrl: './upsert-process.component.html',
  styleUrls: ['./upsert-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertProcessComponent {
  selectedCell?: State | Transition;

  constructor(private readonly dialogService: TuiDialogService, private readonly injector: Injector) {}

  onUpsertStatus(state?: State): void {
    this.dialogService.open('Hello!').subscribe();
  }
}
