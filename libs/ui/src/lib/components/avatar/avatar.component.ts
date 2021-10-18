import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { GetFilePipeModule } from '@nexthcm/cdk';
import { TuiSizeXS, TuiSizeXXL } from '@taiga-ui/core';
import { TuiAvatarModule } from '@taiga-ui/kit';

@Component({
  selector: 'hcm-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @Input() image?: string;
  @Input() text = '';
  @Input() size: TuiSizeXS | TuiSizeXXL = 's';
  private _rounded = false;

  get rounded(): boolean {
    return this._rounded;
  }

  @Input()
  set rounded(value: unknown) {
    this._rounded = coerceBooleanProperty(value);
  }

  private _autoColor = false;

  get autoColor(): boolean {
    return this._autoColor;
  }

  @Input()
  set autoColor(value: unknown) {
    this._autoColor = coerceBooleanProperty(value);
  }
}

@NgModule({
  declarations: [AvatarComponent],
  imports: [CommonModule, TuiAvatarModule, GetFilePipeModule],
  exports: [AvatarComponent],
})
export class AvatarComponentModule {}
