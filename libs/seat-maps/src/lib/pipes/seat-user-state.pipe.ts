import { Pipe, PipeTransform } from '@angular/core';
import { UserState } from '@nexthcm/cdk';

@Pipe({
  name: 'seatUserState',
})
export class SeatUserStatePipe implements PipeTransform {
  transform(value: unknown): string {
    return value ? (UserState[value as keyof typeof UserState] as unknown as string) : '';
  }
}
