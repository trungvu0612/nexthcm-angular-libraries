import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leaveStatus'
})
export class LeaveStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

@NgModule({
  declarations: [LeaveStatusPipe],
  imports: [CommonModule],
  exports: [LeaveStatusPipe]
})
export class LeaveStatusPipeModule {
}
