import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { PartialObserver } from 'rxjs';
import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { PromptComponent } from '../../components';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  component!: PromptComponent;

  constructor(private translocoService: TranslocoService) {}

  registerComponent(component: PromptComponent) {
    this.component = component;
  }

  open(options?: SweetAlertOptions): Promise<SweetAlertResult> {
    return this.component.open(options);
  }

  handleResponse(successfulText: string): PartialObserver<unknown> {
    return {
      next: () =>
        this.open({
          icon: 'success',
          text: this.translocoService.translate(successfulText),
        }),
      error: (err: HttpErrorResponse) => this.open({ icon: 'error', text: err.error.message }),
    };
  }
}
