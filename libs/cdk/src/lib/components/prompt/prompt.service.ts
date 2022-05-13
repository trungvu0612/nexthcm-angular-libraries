import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { PartialObserver } from 'rxjs';
import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

type OpenMethod = (options: SweetAlertOptions) => Promise<SweetAlertResult>;

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  open!: OpenMethod;

  constructor(private translocoService: TranslocoService) {}

  register(open: OpenMethod): void {
    this.open = open;
  }

  generateErrorMessage(err: HttpErrorResponse): string {
    let errorMessage: string;

    if (err.error instanceof ErrorEvent) {
      errorMessage = `${this.translocoService.translate('errorOccurred')}: ${err.error.message}`;
    } else {
      const HTTP_RESPONSE_ERROR_MESSAGES = this.translocoService.translateObject('HTTP_RESPONSE_ERROR_MESSAGES');
      const ERRORS = this.translocoService.translateObject('ERRORS');

      errorMessage =
        ERRORS[err.error.message] || HTTP_RESPONSE_ERROR_MESSAGES[err.status] || HTTP_RESPONSE_ERROR_MESSAGES.default;
    }

    return errorMessage;
  }

  handleResponse(successfulText?: string, callback?: () => void): PartialObserver<unknown> {
    return {
      next: () => {
        if (successfulText) {
          this.open({
            icon: 'success',
            html: this.translocoService.translate(successfulText),
          }).then(() => callback?.());
        } else callback?.();
      },
      error: (err: HttpErrorResponse) => this.open({ icon: 'error', html: this.generateErrorMessage(err) }),
    };
  }
}
