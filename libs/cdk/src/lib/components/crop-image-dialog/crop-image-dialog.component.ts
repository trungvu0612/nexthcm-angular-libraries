import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslocoModule } from '@ngneat/transloco';
import { TuiButtonModule, TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Crop from 'tinycrop';

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Component({
  selector: 'hcm-crop-image-dialog',
  templateUrl: './crop-image-dialog.component.html',
  styleUrls: ['./crop-image-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropImageDialogComponent implements OnInit {
  readonly imageURL = URL.createObjectURL(this.context.data);
  readonly imageURLTrusted = this.sanitizer.bypassSecurityTrustUrl(this.imageURL);
  private region!: Region;
  private image!: CanvasImageSource;

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<Blob, File>,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const crop = Crop.create({
      parent: '#cropImage',
      image: this.imageURL,
      bounds: {
        width: '100%',
        height: 'auto',
      },
      selection: {
        aspectRatio: 1,
        color: 'red',
        activeColor: 'blue',
        minWidth: 1,
        minHeight: 1,
      },
      onInit: () => {
        this.image = crop.image.source;
        this.region = crop.selectionLayer.selection.region;
      },
    });

    crop.on('end', (region: Region) => (this.region = region));
  }

  save(): void {
    const { x, y, width, height } = this.region;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(this.image, x, y, width, height, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        URL.revokeObjectURL(this.imageURL);
        if (blob) this.context.completeWith(blob);
      },
      'image/jpeg',
      0.8
    );
  }

  cancel(): void {
    URL.revokeObjectURL(this.imageURL);
    this.context.$implicit.complete();
  }
}

@NgModule({
  declarations: [CropImageDialogComponent],
  imports: [TranslocoModule, TuiButtonModule],
})
export class CropImageComponentModule {}
