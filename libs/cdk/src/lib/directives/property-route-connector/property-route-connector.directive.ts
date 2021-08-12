import { CommonModule, Location } from '@angular/common';
import { Directive, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';

@Directive({
  selector: '[hcmPropertyRouteName]',
  exportAs: 'hcmPropertyRouteName',
})
export class PropertyRouteConnectorDirective<T> {
  @Output() propertyValueChange = new EventEmitter<T | null>();

  propertyValue: T | null = null;

  constructor(
    private locationRef: Location,
    private activatedRoute: ActivatedRoute,
    private urlSerializer: UrlSerializer
  ) {}

  private _propertyName = '';

  get propertyName(): string {
    return this._propertyName;
  }

  @Input('hcmPropertyRouteName')
  set propertyName(name: string) {
    this._propertyName = name;
    const params = this.activatedRoute.snapshot.queryParams;
    this.propertyValue = !isNaN(Number(params[name]))
      ? Number(params[name])
      : params[name] === null
      ? null
      : params[name];
    this.propertyValueChange.emit(this.propertyValue);
  }

  onValueChange(value: T | null): void {
    this.propertyValue = value;
    this.propertyValueChange.emit(value);
    this.setQueryParam(value);
  }

  setQueryParam(value: T | null): void {
    const tree = this.urlSerializer.parse(this.locationRef.path());
    tree.queryParams = { ...tree.queryParams, [this.propertyName]: value };
    this.locationRef.go(String(tree));
  }
}

@NgModule({
  declarations: [PropertyRouteConnectorDirective],
  imports: [CommonModule],
  exports: [PropertyRouteConnectorDirective],
})
export class PropertyRouteConnectorDirectiveModule {}
