import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'selectOptions',
})
export class SelectOptionsPipe implements PipeTransform {
  transform(options: any): Observable<any> {
    if (!(options instanceof Observable)) {
      options = of(options);
    }
    return options as Observable<any>;
  }
}

@NgModule({
  declarations: [SelectOptionsPipe],
  exports: [SelectOptionsPipe],
})
export class SelectOptionsModule {}
