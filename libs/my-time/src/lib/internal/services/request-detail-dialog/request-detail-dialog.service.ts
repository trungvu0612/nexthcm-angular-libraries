import { Injectable, Injector } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestTypeUrlPaths } from '../../models';
import { MyRequestsService } from '../my-requests.service';
import { RequestDetailDialogComponent } from './request-detail-dialog.component';

@Injectable()
export class RequestDetailDialogService {
  constructor(
    private readonly myRequestsService: MyRequestsService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector
  ) {}

  viewRequestDetail(type: keyof RequestTypeUrlPaths, id: string, userId?: string): Observable<unknown> {
    return this.dialogService
      .open(new PolymorpheusComponent(RequestDetailDialogComponent, this.injector), {
        data: { type, value: id, userId },
        required: true,
      })
      .pipe(catchError(() => of(undefined)));
  }
}
