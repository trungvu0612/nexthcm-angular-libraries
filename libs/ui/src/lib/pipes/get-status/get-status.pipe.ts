import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';

enum CommonStatus {
  deactivate = -1,
  pending,
  active,
  completed,
}

type key = keyof typeof CommonStatus;

@Pipe({
  name: 'getStatus',
})
export class GetStatusPipe implements PipeTransform {
  transform(value?: number | string): string {
    return value === undefined || CommonStatus[value as key] === undefined ? 'NA' : CommonStatus[value as key] + '';
  }
}

@NgModule({
  declarations: [GetStatusPipe],
  imports: [CommonModule],
  exports: [GetStatusPipe],
})
export class GetStatusPipeModule {}
