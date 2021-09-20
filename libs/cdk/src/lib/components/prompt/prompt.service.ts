import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { PartialObserver } from 'rxjs';
import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { PromptComponent } from './prompt.component';

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

  handleResponse(successfulText?: string, callback?: () => void): PartialObserver<unknown> {
    return {
      next: () => {
        if (successfulText) {
          this.open({
            icon: 'success',
            html: this.translocoService.translate(successfulText),
          }).then(() => (callback ? callback() : null));
        } else {
          callback ? callback() : null;
        }
      },
      error: (err: HttpErrorResponse) => {
        let errorMessage: string;
        if (err.error) {
          errorMessage = `${this.translocoService.translate('errorOccurred')}: ${this.translocoService.translate(err.error.code)}`;
        } else if (err.message) {
          errorMessage = `${this.translocoService.translate(err.error.message)}`;
        } else {
          const HTTP_RESPONSE_ERROR_MESSAGES = this.translocoService.translateObject('HTTP_RESPONSE_ERROR_MESSAGES');
          errorMessage = HTTP_RESPONSE_ERROR_MESSAGES[err.status] || HTTP_RESPONSE_ERROR_MESSAGES.default;
        }
        this.open({ icon: 'error', html: errorMessage });
      },
    };
  }
}
