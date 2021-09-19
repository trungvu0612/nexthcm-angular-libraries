import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { switchMap, tap } from 'rxjs/operators';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { loadTemplateVariables } from './template-variables.actions';
import { TemplateVariablesStore } from './template-variables.state';

@Injectable()
export class TemplateVariablesEffects {
  @Effect()
  loadTemplateVariables$ = this.actions$.pipe(
    ofType(loadTemplateVariables),
    switchMap(() =>
      cacheable(this.store, this.adminWorkflowsService.getTemplateVariables().pipe(tap((data) => this.store.set(data))))
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly adminWorkflowsService: AdminWorkflowsService,
    private readonly store: TemplateVariablesStore
  ) {}
}
