import { NgModule, Pipe, PipeTransform } from '@angular/core';

type OperatorFunction<T, A> = (value: T) => A;

@Pipe({
  name: 'map',
})
export class MapPipe implements PipeTransform {
  transform<T, A>(value: T, op1: OperatorFunction<T, A>): A;
  transform<T, A, B>(value: T, op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): B;
  transform(value: any, ...operations: OperatorFunction<any, any>[]): any {
    return operations.reduce((acc, op) => op(acc), value);
  }
}

@NgModule({
  declarations: [MapPipe],
  exports: [MapPipe],
})
export class MapPipeModule {}
