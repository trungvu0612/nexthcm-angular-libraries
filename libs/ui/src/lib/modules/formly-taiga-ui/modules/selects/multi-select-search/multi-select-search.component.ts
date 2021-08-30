import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { isNativeFocused, isPresent, TUI_DEFAULT_IDENTITY_MATCHER, TuiContextWithImplicit } from '@taiga-ui/cdk';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { TuiValueContentContext } from '@taiga-ui/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'hcm-multi-select-search',
  templateUrl: './multi-select-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectSearchComponent extends FieldType {
  defaultOptions = {
    templateOptions: {
      textfieldSize: 'l',
      labelProp: 'name',
      identityMatcher: TUI_DEFAULT_IDENTITY_MATCHER,
      stringify: (item: any) => item.name,
    },
  };
  readonly search$ = new Subject<string | null>();
  readonly items$: Observable<any[] | null> = this.search$.pipe(
    filter((value) => !!value),
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((search) => this.to.serverRequest(search).pipe(startWith(null)) as Observable<any[] | null>),
    catchError(() => of([])),
    startWith([])
  );
  stringify$: Observable<TuiStringHandler<any>> = this.items$.pipe(
    filter(isPresent),
    map((items) => new Map(items.map((item) => [item[this.to.valueProp], item[this.to.labelProp]]))),
    map(
      (map) =>
        ({ $implicit }: TuiContextWithImplicit<any>) =>
          map.get($implicit) || ''
    )
  );

  getContext($implicit: any, { nativeElement }: ElementRef<HTMLElement>): TuiValueContentContext<any> {
    return { $implicit, active: isNativeFocused(nativeElement) };
  }
}
