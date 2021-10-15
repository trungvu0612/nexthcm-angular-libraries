import { Pipe, PipeTransform } from '@angular/core';
import { BaseObject } from '@nexthcm/cdk';
import { isPresent } from '@taiga-ui/cdk';

@Pipe({
  name: 'baseObjects',
})
export class BaseObjectsPipe implements PipeTransform {
  transform(values: BaseObject[]): string {
    return (values || [])
      .map((value) => value.name)
      .filter(isPresent)
      .join(', ');
  }
}
