import { Injectable } from '@angular/core';
import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { PromptComponent } from '../../components';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  component!: PromptComponent;

  registerComponent(component: PromptComponent) {
    this.component = component;
  }

  open(options?: SweetAlertOptions): Promise<SweetAlertResult> {
    return this.component.open(options);
  }
}
