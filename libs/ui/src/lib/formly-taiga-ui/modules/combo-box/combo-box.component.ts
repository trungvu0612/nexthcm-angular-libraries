import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiValueContentContext } from '@taiga-ui/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, shareReplay, startWith, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'formly-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ComboBoxComponent extends FieldType {
  defaultOptions = {
    templateOptions: {
      textfieldSize: 'l',
      textfieldLabelOutside: true,
      stringify: (item: any) => item.name,
      imageProp: 'image',
      labelProp: 'name',
    },
  };
  readonly search$ = new Subject<string>();
  readonly items$: Observable<ReadonlyArray<any> | null> = this.search$.pipe(
    filter((search) => !!search),
    distinctUntilChanged(),
    switchMap(
      (search) => this.to.serverRequest(search).pipe(startWith(null)) as Observable<ReadonlyArray<any> | null>
    ),
    takeUntil(this.destroy$),
    shareReplay(1)
  );
  readonly context!: TuiValueContentContext<any>;

  constructor(private destroy$: TuiDestroyService) {
    super();
  }

  onSearchChange(searchQuery: string | null) {
    if (searchQuery) {
      this.search$.next(searchQuery);
    }
  }
}
