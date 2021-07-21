import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { PromptComponent } from '../../components';
import { PromptService } from '../../services';

@Component({
  selector: 'hcm-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  @ViewChild('prompt', { static: true }) prompt!: PromptComponent;

  constructor(private promptService: PromptService) {}

  ngOnInit(): void {
    this.promptService.registerComponent(this.prompt);
  }
}
