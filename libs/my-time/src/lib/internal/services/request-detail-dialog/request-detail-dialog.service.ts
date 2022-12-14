import { Injectable, Injector } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RequestTypeUrlPaths } from '../../models';
import { RequestDetailDialogComponent } from './request-detail-dialog.component';

@Injectable()
export class RequestDetailDialogService {
  constructor(private readonly dialogService: TuiDialogService, private readonly injector: Injector) {}

  viewRequestDetail(type: keyof RequestTypeUrlPaths, requestId: string, userId?: string): Observable<unknown> {
    return this.dialogService
      .open(new PolymorpheusComponent(RequestDetailDialogComponent, this.injector), {
        data: { type, value: requestId, userId },
        required: true,
      })
      .pipe(catchError(() => of(undefined)));
  }
}
