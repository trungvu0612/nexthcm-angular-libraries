import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injectable, NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { AbstractTuiDialogService, TUI_DIALOGS, TuiDialog } from '@taiga-ui/cdk';
import { TuiButtonModule } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusComponent, PolymorpheusModule } from '@tinkoff/ng-polymorpheus';

interface PromptOptions {
  readonly heading: string;
  readonly headingParam?: string;
  readonly buttons: readonly [string, string];
}

@Component({
  selector: 'hcm-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptComponent {
  constructor(@Inject(POLYMORPHEUS_CONTEXT) readonly context: TuiDialog<PromptOptions, boolean>) {}

  onClick(response: boolean): void {
    this.context.completeWith(response);
  }
}

@Injectable({
  providedIn: 'root',
})
export class PromptService extends AbstractTuiDialogService<PromptOptions> {
  readonly defaultOptions = {
    heading: '',
    buttons: ['Yes', 'No'],
  } as const;
  readonly component = new PolymorpheusComponent(PromptComponent);
}

@NgModule({
  declarations: [PromptComponent],
  imports: [CommonModule, TranslocoModule, PolymorpheusModule, TuiButtonModule],
  exports: [PromptComponent],
  providers: [{ provide: TUI_DIALOGS, useExisting: PromptService, multi: true }],
})
export class PromptComponentModule {}
