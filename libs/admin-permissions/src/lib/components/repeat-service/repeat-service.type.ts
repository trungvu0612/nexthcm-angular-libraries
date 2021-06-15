import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'formly-repeat-service',
  templateUrl: './repeat-service.type.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepeatServiceComponent extends FieldArrayType {
  expandedList = [true];

  add(): void {
    super.add();
    this.expandedList.push(true);
  }

  toggleExpandable(index: number): void {
    this.expandedList[index] = !this.expandedList[index];
  }

  remove(index: number): void {
    super.remove(index);
    this.expandedList.splice(index, 1);
  }
}
