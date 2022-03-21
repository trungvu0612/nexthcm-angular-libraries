import { CommonModule, Location } from '@angular/common';
import { Directive, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import omit from 'just-omit';

@Directive({
  selector: '[hcmPropertyRouteName]',
  exportAs: 'hcmPropertyRouteName',
})
export class PropertyRouteConnectorDirective<T> {
  @Output() propertyValueChange = new EventEmitter<T | null>();

  propertyValue: T | null = null;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly locationRef: Location,
    private readonly urlSerializer: UrlSerializer
  ) {}

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
    const tree = this.urlSerializer.parse(this.locationRef.path());

    tree.queryParams =
      value === null ? omit(tree.queryParams, this.propertyName) : { ...tree.queryParams, [this.propertyName]: value };
    this.locationRef.go(String(tree));
  }
}

@NgModule({
  declarations: [PropertyRouteConnectorDirective],
  imports: [CommonModule],
  exports: [PropertyRouteConnectorDirective],
})
export class PropertyRouteConnectorDirectiveModule {}
