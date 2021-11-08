import { CommonModule } from '@angular/common';
import { Directive, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Directive({
  selector: '[hcmPropertyRouteName]',
  exportAs: 'hcmPropertyRouteName',
})
export class PropertyRouteConnectorDirective<T> {
  @Output() propertyValueChange = new EventEmitter<T | null>();

  propertyValue: T | null = null;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router) {}

  private _propertyName = '';

  get propertyName(): string {
    return this._propertyName;
  }

  @Input('hcmPropertyRouteName')
  set propertyName(name: string) {
    this._propertyName = name;

    const params = this.activatedRoute.snapshot.queryParams;

    if (['null', ''].includes(params[name])) {
      return;
    }

    this.propertyValue = !isNaN(Number(params[name])) ? Number(params[name]) : params[name];
    this.propertyValueChange.emit(this.propertyValue);
  }

  onValueChange(value: T | null): void {
    this.propertyValue = value;
    this.propertyValueChange.emit(value);
    this.setQueryParam(value);
  }

  setQueryParam(value: T | null): void {
    this.router.navigate([], {
      queryParams: { [this.propertyName]: value },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}

@NgModule({
  declarations: [PropertyRouteConnectorDirective],
  imports: [CommonModule],
  exports: [PropertyRouteConnectorDirective],
})
export class PropertyRouteConnectorDirectiveModule {}
