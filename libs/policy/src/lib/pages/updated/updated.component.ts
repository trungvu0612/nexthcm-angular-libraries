import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';

@Component({
  selector: 'hcm-updated',
  templateUrl: './updated.component.html',
  styleUrls: ['./updated.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdatedComponent implements OnInit {
  inputDate = new FormControl();

  constructor() {
  }

  ngOnInit(): void {
  }
}
