import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, ViewChild } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { SwalComponent, SwalPortalTargets, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TuiButtonModule } from '@taiga-ui/core';
import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

import { PromptService } from './prompt.service';

const DEFAULT_OPTIONS: SweetAlertOptions = {
  showCancelButton: false,
  showConfirmButton: true,
  cancelButtonText: 'cancel',
  confirmButtonText: 'ok',
};

@Component({
  selector: 'hcm-prompt',
  templateUrl: './prompt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptComponent {
  @ViewChild('swal') swal!: SwalComponent;
  swalOptions = DEFAULT_OPTIONS;

  constructor(
    readonly targets: SwalPortalTargets,
    private readonly promptService: PromptService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.promptService.register(this.open.bind(this));
  }

  open(options?: SweetAlertOptions): Promise<SweetAlertResult> {
    this.swalOptions = { ...DEFAULT_OPTIONS, ...options };
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
