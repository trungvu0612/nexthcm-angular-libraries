import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@ngneat/reactive-forms';
import { FieldType } from '@ngx-formly/core';
import { AdminPermissionsService } from '../../services/admin-permissions.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { PermissionForm } from '../../models/policy';

@Component({
  selector: 'formly-input-actions',
  templateUrl: './input-actions.type.html',
  styleUrls: ['./input-actions.type.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class InputActionsComponent extends FieldType implements OnInit {
  expanded$ = new BehaviorSubject(false);
  permissionsForm!: FormArray<PermissionForm>;

  constructor(
    private adminPermissions: AdminPermissionsService,
    private formBuilder: FormBuilder,
    private destroy$: TuiDestroyService
  ) {
    super();
  }

  ngOnInit(): void {
    const source$: Observable<PermissionForm[]> = this.formControl.value
      ? of(this.formControl.value)
      : this.adminPermissions
          .select('actions')
          .pipe(map((actions) => actions.map((action) => ({ action, resource: null }))));

    source$.subscribe((sources) => {
      this.permissionsForm = this.formBuilder.array(
        sources.map(
          (value) =>
            new FormGroup({
              action: new FormControl(value.action),
              resource: new FormControl(value.resource),
            })
        )
      );

      this.permissionsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((permissions) => {
        this.formControl.setValue(permissions);
      });
    });

    const service = this.form.get('service');
    if (service) {
      const expand = (value: unknown) => value && !this.expanded$.value && this.toggleExpanded();
      expand(service.value);
      service.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(expand);
    }
  }

  toggleExpanded(): void {
    this.expanded$.next(!this.expanded$.value);
  }
}
