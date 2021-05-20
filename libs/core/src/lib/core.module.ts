import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { ENVIRONMENT } from './core.config';
import { Environment } from './constants';

@NgModule({
  imports: [CommonModule]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() coreModule: CoreModule) {
    if (coreModule) {
      throw new Error('CoreModule has already been loaded. Import CoreModule in the AppModule only.');
    }
  }

  static forRoot(environments: Environment): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [{ provide: ENVIRONMENT, useValue: environments }]
    };
  }

}
