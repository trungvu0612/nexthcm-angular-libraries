import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { isPresent } from '@taiga-ui/cdk';

@Pipe({
  name: 'joinByKey',
})
export class JoinByKeyPipe<T extends Record<string, unknown>> implements PipeTransform {
  transform(values: T[], key: string): string {
    return (values || [])
      .map((value) => value[key])
      .filter(isPresent)
      .join(', ');
  }
}

@NgModule({
  declarations: [JoinByKeyPipe],
  imports: [],
  exports: [JoinByKeyPipe],
})
export class JoinByKeyPipeModule {}
