import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { TransferLeaveEntitlementType } from '../../enums';

@Pipe({
  name: 'transferLeaveEntitlementType',
})
export class TransferLeaveEntitlementTypePipe implements PipeTransform {
  transform(key: unknown): string {
    return key
      ? (TransferLeaveEntitlementType[key as keyof typeof TransferLeaveEntitlementType] as unknown as string)
      : '';
  }
}

@NgModule({
  declarations: [TransferLeaveEntitlementTypePipe],
  imports: [],
  exports: [TransferLeaveEntitlementTypePipe],
})
export class TransferLeaveEntitlementTypePipeModule {}
