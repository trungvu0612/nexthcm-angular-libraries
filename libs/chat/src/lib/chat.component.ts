import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
