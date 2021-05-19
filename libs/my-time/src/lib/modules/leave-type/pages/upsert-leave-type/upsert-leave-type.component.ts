import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hcm-upsert-leave-type',
  templateUrl: './upsert-leave-type.component.html',
  styleUrls: ['./upsert-leave-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertLeaveTypeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
