import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, ViewChild } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { SwalComponent, SwalPortalTargets, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TuiButtonModule } from '@taiga-ui/core';
import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'hcm-prompt',
  templateUrl: './prompt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptComponent {
  @ViewChild('swal') swal!: SwalComponent;
  swalOptions: SweetAlertOptions = {
    showCancelButton: false,
    showConfirmButton: true,
    confirmButtonText: 'ok',
    cancelButtonText: 'cancel',
  };

  constructor(public readonly targets: SwalPortalTargets, private cdr: ChangeDetectorRef) {}

  open(options?: SweetAlertOptions): Promise<SweetAlertResult> {
    this.swalOptions = { ...this.swalOptions, ...options };
    this.cdr.detectChanges();
    return this.swal.fire();
  }
}

@NgModule({
  declarations: [PromptComponent],
  imports: [CommonModule, TranslocoModule, TuiButtonModule, SweetAlert2Module],
  exports: [PromptComponent],
})
export class PromptComponentModule {}
