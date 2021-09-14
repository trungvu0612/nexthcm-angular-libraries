import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonStatus } from '../../enums';

type Key = keyof typeof CommonStatus;

@Pipe({
  name: 'getStatus',
})
export class GetStatusPipe implements PipeTransform {
  transform(value?: number | string): string {
    return value === undefined || CommonStatus[value as Key] === undefined ? 'NA' : CommonStatus[value as Key] + '';
  }
}

@NgModule({
  declarations: [GetStatusPipe],
  imports: [CommonModule],
  exports: [GetStatusPipe],
})
export class GetStatusPipeModule {}
