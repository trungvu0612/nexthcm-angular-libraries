import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'formly-repeat-service',
  templateUrl: './repeat-service.type.html',
  styleUrls: ['./repeat-service.type.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepeatServiceComponent extends FieldArrayType implements OnInit {
  expandedList!: boolean[];

  ngOnInit(): void {
    this.expandedList = this.field.fieldGroup?.map((item, index) => !index) || [true];
  }

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
