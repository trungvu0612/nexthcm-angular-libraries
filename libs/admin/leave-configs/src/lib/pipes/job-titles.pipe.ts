import { Pipe, PipeTransform } from '@angular/core';
import { BaseObject } from '@nexthcm/cdk';
import { isPresent } from '@taiga-ui/cdk';

@Pipe({
  name: 'jobTitles',
})
export class JobTitlesPipe implements PipeTransform {
  transform(jobTitles: BaseObject[]): string {
    return jobTitles
      .map((jobTitle) => jobTitle.name)
      .filter(isPresent)
      .join(', ');
  }
}
