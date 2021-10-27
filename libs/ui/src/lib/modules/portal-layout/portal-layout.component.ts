import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { PromptComponent, PromptService } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-portal-layout',
  templateUrl: './portal-layout.component.html',
  styleUrls: ['./portal-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalLayoutComponent implements OnInit {
  @ViewChild('prompt', { static: true }) prompt!: PromptComponent;

  constructor(private promptService: PromptService) {}

  ngOnInit(): void {
    this.promptService.registerComponent(this.prompt);
  }
}
