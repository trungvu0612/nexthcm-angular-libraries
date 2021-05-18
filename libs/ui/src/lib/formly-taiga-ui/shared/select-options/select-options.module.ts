import { NgModule } from '@angular/core';
import { SelectOptionsPipe } from './select-options.pipe';

@NgModule({
  declarations: [SelectOptionsPipe],
  exports: [SelectOptionsPipe],
})
export class SelectOptionsModule {}
