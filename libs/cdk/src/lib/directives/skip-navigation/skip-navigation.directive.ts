import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Directive, Input, NgModule, Optional } from '@angular/core';
import { RouterLink, RouterLinkWithHref } from '@angular/router';

@Directive({
  selector: '[hcmSkipNavigation][routerLink]',
})
export class SkipNavigationDirective {
  private _skipNavigation?: boolean;

  constructor(@Optional() routerLink: RouterLink, @Optional() routerLinkWithHref: RouterLinkWithHref) {
    const link = routerLink || routerLinkWithHref;
    const onClick = link.onClick;

    link.onClick = (...args) => {
      if (this._skipNavigation) {
        return !routerLinkWithHref;
      } else {
        return onClick.apply(link, args);
      }
    };
  }

  @Input()
  set hcmSkipNavigation(value: unknown) {
    this._skipNavigation = coerceBooleanProperty(value);
  }
}

@NgModule({
  declarations: [SkipNavigationDirective],
  imports: [CommonModule],
  exports: [SkipNavigationDirective],
})
export class SkipNavigationDirectiveModule {}
