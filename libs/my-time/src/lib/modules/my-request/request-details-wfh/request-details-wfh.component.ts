import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimeSheetUpdateReq } from '../../../models/requests';
import { MyRequestService } from '../../../services/my-request.service';

@Component({
  selector: 'hcm-request-details-wfh',
  templateUrl: './request-details-wfh.component.html',
  styleUrls: ['./request-details-wfh.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDetailsWfhComponent implements OnInit {
  STATUS: { [key: string]: string } = {
    '-1': 'rejected',
    '1': 'approved',
    '0': 'cancelled',
    '2': 'waiting',
    '3': 'taken',
    '4': 'weekend',
    '5': 'holiday',
  };

  req!: TimeSheetUpdateReq;
  dataId = this.context.data || '';

  data$: Observable<any> = this.myRequestService.getWFHId(this.dataId).pipe(map((data) => data.data));

  constructor(
    private myRequestService: MyRequestService,
    private formbuilder: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<boolean>
  ) {}

  ngOnInit(): void {
    console.log('dataIddddddddd', this.data$);
  }

  close(): void {
    // this.context.completeWith(true);
  }

  cancel() {}

  edit(id: string) {}
}
