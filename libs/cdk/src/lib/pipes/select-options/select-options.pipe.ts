import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'selectOptions',
})
export class SelectOptionsPipe implements PipeTransform {
  transform<T = any>(options: any): Observable<T> {
    if (!(options instanceof Observable)) {
      options = of(options);
    }
    return options as Observable<T>;
  }
}

@NgModule({
  declarations: [SelectOptionsPipe],
  exports: [SelectOptionsPipe],
})
export class SelectOptionsModule {}
