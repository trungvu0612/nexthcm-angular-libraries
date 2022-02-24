import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { switchMap, tap } from 'rxjs/operators';

import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { loadValidatorTypes } from './validator-types.actions';
import { ValidatorTypesStore } from './validator-types.state';

@Injectable()
export class ValidatorTypesEffects {
  @Effect()
  loadValidatorTypes$ = this.actions$.pipe(
    ofType(loadValidatorTypes),
    switchMap(() =>
      cacheable(this.store, this.adminWorkflowsService.getValidatorTypes().pipe(tap((data) => this.store.set(data))))
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly adminWorkflowsService: AdminWorkflowsService,
    private readonly store: ValidatorTypesStore
  ) {}
}
