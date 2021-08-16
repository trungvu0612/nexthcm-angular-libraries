import { Injector, NgModule } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import { APP_CONFIG } from '@nexthcm/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

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
