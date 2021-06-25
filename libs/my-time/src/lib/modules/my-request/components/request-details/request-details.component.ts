import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TimeSheetUpdateReq } from '../../../../models/requests';

@Component({
  selector: 'hcm-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDetailsComponent implements OnInit {
  req!: TimeSheetUpdateReq;
  type!: string;
  title!: string;

  constructor(
    private formbuilder: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<boolean, { type: string; req: TimeSheetUpdateReq }>
  ) {}

  ngOnInit(): void {
    this.type = this.context.data.type;
    this.req = this.context.data.req;
    console.log(this.req);
    switch (this.type) {
      case 'timesheet':
        this.title = 'Update Time Detail';
    }
  }

  close(): void {
    this.context.completeWith(true);
  }
}
