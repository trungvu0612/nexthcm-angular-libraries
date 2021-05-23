import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'formly-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class SelectSearchComponent extends FieldType implements AfterViewInit {
  items: any[] = [];

  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      trackByFn: (item: any) => item.id,
      addTag: false,
      multiple: false,
      labelProp: 'label',
      valueProp: '',
      imageProp: 'image',
      notFoundText: 'No items found',
      typeToSearchText: 'Type to search',
      minTermLength: 0,
      hideSelected: false,
      virtualScroll: false,
      numberOfItemsFromEndBeforeFetchingMore: 5,
      useOptionTemplate: false,
      useLabelTemplate: false,
    },
  };

  isLoading = false;
  completed = false;
  search$ = new Subject<string>();
  page$ = new BehaviorSubject<number>(0);
  context!: { $implicit: any };

  constructor(private destroy$: TuiDestroyService) {
    super();
  }

  ngAfterViewInit(): void {
    combineLatest([
      this.search$.pipe(
        distinctUntilChanged(),
        tap(() => {
          this.completed = false;
          this.items.length = 0;
          this.page$.next(0);
        })
      ),
      this.page$,
    ])
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap(([term, page]) =>
          this.to.serverRequest(term, page).pipe(
            catchError(() => of([])),
            tap(() => (this.isLoading = false))
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        if (Array.isArray(res) && res.length) {
          this.items = this.items.concat(res);
        } else {
          this.completed = true;
        }
      });
  }

  onScroll($event: { start: number; end: number }): void {
    if (this.isLoading || this.completed) {
      return;
    }
    if ($event.end + this.to.numberOfItemsFromEndBeforeFetchingMore >= this.items.length) {
      this.page$.next(this.page$.value + 1);
    }
  }

  onScrollToEnd(): void {
    this.page$.next(this.page$.value + 1);
  }
}
