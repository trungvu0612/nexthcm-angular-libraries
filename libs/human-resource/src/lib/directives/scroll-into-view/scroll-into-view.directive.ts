import { Directive, ElementRef, Inject, Input } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[hcmScrollIntoView]',
  providers: [TuiDestroyService],
})
export class ScrollIntoViewDirective {
  private readonly scroll$ = new Subject<boolean>();

  constructor(@Inject(ElementRef) { nativeElement }: ElementRef<HTMLElement>, destroy$: TuiDestroyService) {
    this.scroll$
      .pipe(
        debounceTime(250),
        filter((shallWe) => shallWe),
        takeUntil(destroy$)
      )
      .subscribe(() => nativeElement.scrollIntoView(true));
  }

  @Input() set hcmScrollIntoView(shallWe: boolean) {
    this.scroll$.next(shallWe);
  }
}
