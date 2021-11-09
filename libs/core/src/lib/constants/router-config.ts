import { ExtraOptions } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';

export const ROUTER_CONFIG: ExtraOptions = {
  initialNavigation: 'enabledNonBlocking',
  paramsInheritanceStrategy: 'always', // get the lazy modules routing params
  preloadingStrategy: QuicklinkStrategy,
};
