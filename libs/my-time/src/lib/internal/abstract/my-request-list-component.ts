import { Directive, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { Pagination } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';

import { AbstractRequestListComponent } from './request-list-component';

@Directive()
export abstract class AbstractMyRequestListComponent<T> extends AbstractRequestListComponent<T> implements OnInit {
  protected constructor(
    override readonly state: RxState<Pagination<T>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly authService: AuthService
  ) {
    super(state, activatedRoute);
  }

  get userId(): string {
    return this.authService.get('userInfo', 'userId');
  }

  override ngOnInit(): void {
    if (this.requestId) {
      this.viewRequestDetail$.next([this.requestId, this.userId]);
    }
  }
}
