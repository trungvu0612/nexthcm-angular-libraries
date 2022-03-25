import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UrlSerializer } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { TuiCheckboxLabeledModule } from '@taiga-ui/kit';
import omit from 'just-omit';

@Component({
  selector: 'hcm-basic-filter',
  templateUrl: './basic-filter.component.html',
  styleUrls: ['./basic-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicFilterComponent {
  @Input() label!: string;
  @Input() value!: string;
  @Output() filterChange = new EventEmitter<string | null>();
  active = false;

  constructor(private readonly location: Location, private readonly urlSerializer: UrlSerializer) {}

  private _key = '';

  @Input() set key(key: string) {
    this._key = key;
    this.active = !!this.urlSerializer.parse(this.location.path()).queryParams[key];
  }

  onChangeValue(active: boolean): void {
    this.active = active;
    const filterValue = this.active ? this.value : null;
    this.filterChange.emit(filterValue);
    const tree = this.urlSerializer.parse(this.location.path());
    tree.queryParams = filterValue
      ? { ...tree.queryParams, [this._key]: filterValue }
      : omit(tree.queryParams, this._key);
    this.location.go(tree.toString());
  }
}

@NgModule({
  declarations: [BasicFilterComponent],
  imports: [FormsModule, TranslocoModule, TuiCheckboxLabeledModule],
  exports: [BasicFilterComponent],
})
export class BasicFilterComponentModule {}
