import { Pipe, PipeTransform } from '@angular/core';
import { OrganizationalUnit } from '../models/tenant';

@Pipe({
  name: 'getSpanChart',
})
export class GetSpanChartPipe implements PipeTransform {
  transform(item: Partial<OrganizationalUnit>): number {
    if (item.descendants?.length)
      return item.descendants.map((i) => this.transform(i)).reduce((a: number, b: number) => a + b);
    else return 1;
  }
}
