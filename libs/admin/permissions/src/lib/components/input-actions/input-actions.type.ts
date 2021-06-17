import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@ngneat/reactive-forms';
import { FieldType } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'formly-input-actions',
  templateUrl: './input-actions.type.html',
  styles: [':host {padding-left: 20% !important; @apply block p-7;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class InputActionsComponent extends FieldType implements OnInit {
  actions = ['List', 'Read', 'Write'];
  expanded = [false];
  expandedActions = this.actions.map(() => true);
  actionControls: FormControl<boolean | null>[] = this.actions.map(() => new FormControl(false));
  actionForm: FormArray<[]>;
  resources = ['Resource 1', 'Resource 2', 'Resource 3', 'Resource 4'];

  constructor(fb: FormBuilder, private changeDetector: ChangeDetectorRef, private destroy$: TuiDestroyService) {
    super();
    this.actionForm = fb.array([[], [], []]);
  }

  ngOnInit(): void {
    this.model.actions = {};
    this.form.controls.service.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.expanded = [true];
      this.changeDetector.detectChanges();
    });
    this.actionControls.forEach((control, index) =>
      control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        let resources: string[];
        if (value) resources = this.resources;
        else resources = [];
        this.actionForm.at(index).setValue(resources);
      })
    );
    this.actionForm.controls.forEach((control, index) =>
      control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: string[]) => {
        this.model.actions[this.actions[index]] = value;
        let check;
        if (value.length === 0) check = false;
        else if (value.length === this.resources.length) check = true;
        else check = null;
        this.actionControls[index].setValue(check, { emitEvent: false });
      })
    );
  }

  toggleExpanded(index: number, actions?: true): void {
    const expanded = actions ? this.expandedActions : this.expanded;
    expanded[index] = !expanded[index];
  }
}
