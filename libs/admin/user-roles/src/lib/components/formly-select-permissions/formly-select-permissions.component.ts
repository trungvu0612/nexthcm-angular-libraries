import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { FieldType } from '@ngx-formly/core';
import { ALWAYS_TRUE_HANDLER, isNativeFocused, TuiIdentityMatcher, TuiValidationError } from '@taiga-ui/cdk';
import { TuiValueContentContext } from '@taiga-ui/core';
import { PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { API, BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { BasePermission } from '../../models/base-permission';
import { AdminUserRolesService } from '../../services/admin-user-roles.service';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-formly-select-permissions',
  templateUrl: './formly-select-permissions.component.html',
  styleUrls: ['./formly-select-permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlySelectPermissionsComponent extends FieldType implements AfterViewInit {
  @ViewChild('table', { static: true }) table!: BaseComponent;

  defaultOptions = {
    templateOptions: {
      textfieldSize: 'l',
    },
  };
  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
    orderEnabled: false,
  };
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_USER_ROLE_PERMISSION_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'code', title: result.code },
        { key: 'description', title: result.description },
        { key: 'functions', title: result.functions },
      ])
    );
  valueChange$!: Observable<BasePermission[]>;
  readonly search$ = new Subject<string | null>();
  readonly items$: Observable<BasePermission[] | null> = this.search$.pipe(
    filter((value) => value !== null),
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((search) => this.adminUserRolesService.getPermissions(search).pipe(startWith(null))),
    catchError(() => of([])),
    startWith([])
  );
  disabledItemHandler = ALWAYS_TRUE_HANDLER;
  @ViewChild('errorContent', { static: true }) errorContent?: PolymorpheusTemplate<{}>;
  error: TuiValidationError | null = null;
  readonly context!: { $implicit: any };

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly adminUserRolesService: AdminUserRolesService
  ) {
    super();
  }

  readonly stringify = (item: BasePermission) => item.name;

  readonly identityMatcher: TuiIdentityMatcher<any> = (item1: BasePermission, item2: BasePermission) =>
    item1.id === item2.id;

  readonly item = (item: BasePermission) => item;

  ngAfterViewInit(): void {
    this.error = new TuiValidationError(this.errorContent || '');
    this.valueChange$ = this.formControl.valueChanges.pipe(
      startWith(this.formControl.value as BasePermission[]),
      tap((data) => this.table.apiEvent({ type: API.setPaginationDisplayLimit, value: data?.length || 0 }))
    );
  }

  getContext($implicit: any, { nativeElement }: ElementRef<HTMLElement>): TuiValueContentContext<any> {
    return { $implicit, active: isNativeFocused(nativeElement) };
  }

  delete(index: number): void {
    const permissions = (this.formControl.value as BasePermission[]).slice();
    const removingItem = permissions.splice(index, 1)[0];

    if (this.to.onRemovePermission) {
      this.to.onRemovePermission(removingItem);
    }
    this.formControl.setValue(permissions);
  }
}
