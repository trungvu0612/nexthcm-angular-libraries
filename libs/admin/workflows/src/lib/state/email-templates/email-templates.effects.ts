import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { switchMap, tap } from 'rxjs/operators';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { loadEmailTemplates, removeEmailTemplate, upsertEmailTemplate } from './email-templates.actions';
import { EmailTemplatesStore } from './email-templates.state';

@Injectable()
export class EmailTemplatesEffects {
  @Effect()
  loadWorkflows$ = this.actions$.pipe(
    ofType(loadEmailTemplates),
    switchMap(() =>
      cacheable(
        this.emailTemplatesStore,
        this.adminWorkflowsService
          .getAllEmailTemplates()
          .pipe(tap((templates) => this.emailTemplatesStore.set(templates)))
      )
    )
  );

  @Effect()
  upsertEmailTemplate$ = this.actions$.pipe(
    ofType(upsertEmailTemplate),
    tap(({ data }) => this.emailTemplatesStore.upsert(data.id, data))
  );

  @Effect()
  removeEmailTemplate$ = this.actions$.pipe(
    ofType(removeEmailTemplate),
    tap(({ id }) => this.emailTemplatesStore.remove(id))
  );

  constructor(
    private readonly actions$: Actions,
    private readonly adminWorkflowsService: AdminWorkflowsService,
    private readonly emailTemplatesStore: EmailTemplatesStore
  ) {}
}
