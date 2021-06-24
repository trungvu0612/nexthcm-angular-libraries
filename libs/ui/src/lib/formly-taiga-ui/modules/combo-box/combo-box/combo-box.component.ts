import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { TUI_DEFAULT_IDENTITY_MATCHER, TuiDestroyService } from '@taiga-ui/cdk';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'formly-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ComboBoxComponent extends FieldType implements OnInit {
  defaultOptions = {
    templateOptions: {
      textfieldSize: 'l',
      textfieldLabelOutside: true,
      identityMatcher: TUI_DEFAULT_IDENTITY_MATCHER,
      stringify: (item: any) => item.name,
      imageProp: 'image',
      labelProp: 'name',
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

  constructor(private destroy$: TuiDestroyService) {
    super();
  }

  ngOnInit(): void {
    this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) this.to.textfieldLabelOutside = true;
    });
  }
}
