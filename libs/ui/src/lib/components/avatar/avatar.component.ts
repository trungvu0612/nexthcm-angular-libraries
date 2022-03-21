import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { GetFilePipeModule } from '@nexthcm/cdk';
import { PushModule } from '@rx-angular/template';
import { tuiDefaultProp } from '@taiga-ui/cdk';
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
  @Input() @tuiDefaultProp() text = '';
  @Input() @tuiDefaultProp() size: TuiSizeXS | TuiSizeXXL = 's';
  @Input() width: string | null = null;
  @Input() height: string | null = null;
  @Input() borderRadius: string | null = null;
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

  get computedText(): string {
    if (this.image || this.text === '') {
      return '';
    }

    const words = this.text.split(' ');

    return words.length > 1 ? [words[0], words[words.length - 1]].join(' ') : words[0];
  }
}

@NgModule({
  declarations: [AvatarComponent],
  imports: [CommonModule, TuiAvatarModule, GetFilePipeModule, PushModule],
  exports: [AvatarComponent],
})
export class AvatarComponentModule {}
