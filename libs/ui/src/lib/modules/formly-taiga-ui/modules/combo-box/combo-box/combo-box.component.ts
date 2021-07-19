import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { TUI_DEFAULT_IDENTITY_MATCHER, TuiDestroyService } from '@taiga-ui/cdk';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { TuiIdentityMatcher } from '@taiga-ui/cdk/types';

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
      labelProp: 'name',
      imageProp: 'image',
      matcherBy: 'default',
      stringify: (item: any) => item.name,
    },
  };
  readonly search$ = new Subject<string>();
  readonly items$: Observable<ReadonlyArray<any> | null> = this.search$.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((search) => this.to.serverRequest(search) as Observable<ReadonlyArray<any> | null>),
    takeUntil(this.destroy$)
  );

  readonly matcher: { [p: string]: TuiIdentityMatcher<unknown> } = {
    default: TUI_DEFAULT_IDENTITY_MATCHER,
    id: (i1: any, i2: any) => i1.id === i2.id,
  };

  constructor(private destroy$: TuiDestroyService) {
    super();
  }

  getSubLabel(item: any): string | undefined {
    return (
      this.to.subLabelProp &&
      this.to.subLabelProp.split('.').reduce((acc: any, cur: any) => (acc && acc[cur]) || null, item)
    );
  }
}
