import { Injector, NgModule } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { APP_CONFIG } from '../app-config.token';

export const createApollo = (httpLink: HttpLink, injector: Injector) => {
  const uri = injector.get(APP_CONFIG).graphqlUrl;
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
};

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, Injector],
    },
  ],
})
export class GraphqlModule {}
