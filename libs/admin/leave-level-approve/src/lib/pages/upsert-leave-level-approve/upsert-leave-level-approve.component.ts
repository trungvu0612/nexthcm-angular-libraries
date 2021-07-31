import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LevelApprove } from '../../models/level-approve';
import { LevelApproveService } from '../../services/level-approve.service';

@Component({
  selector: 'hcm-upsert-leave-level-approve',
  templateUrl: './upsert-leave-level-approve.component.html',
  styleUrls: ['./upsert-leave-level-approve.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertLeaveLevelApproveComponent implements OnInit {

  params$ = new BehaviorSubject<{ page?: number; size?: number }>({ size: 100 });
  jobTitles$: Observable<any[]> = this.levelApproveService
    .getJobTitles(this.params$.value)
    .pipe(map((data) => data.items));

  leaveTypes$: Observable<any[]> = this.levelApproveService
    .getLeaveTypes(this.params$.value)
    .pipe(map((data) => data.items));

  data = this.context.data || '';

  readonly adminUserRoleForm = new FormGroup({});
  model: Partial<LevelApprove> = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'leaveType',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'Leave Type',
        labelClassName: 'font-semibold',
        placeholder: 'Leave Type',
        required: true,
        options: this.leaveTypes$,
        labelProp: 'name',
        matcherBy: 'id',
      },
    },
    {
      key: 'jobTitles',
      className: 'tui-form__row block',
      type: 'multi-select',
      templateOptions: {
        translate: true,
        required: true,
        label: 'roles',
        labelClassName: 'font-semibold',
        placeholder: 'chooseRoles',
        options: this.jobTitles$,
        labelProp: 'name',
        matcherBy: 'id',
      },
    },
    {
      key: 'totalLeave',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'Total Leave',
        placeholder: 'Total leave can approve',
        textfieldLabelOutside: true,
      },
      validators: { validation: [RxwebValidators.numeric({ acceptValue: NumericValueType.PositiveNumber })] },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, LevelApprove>,
    private levelApproveService: LevelApproveService,
  ) {}

  ngOnInit(): void {
    // console.log('iddddd data', this.data);
    //
    // if (this.data !== '') {
    //   this.adminUserRolesService.getAdminUserRolesId(this.data).subscribe((item) => {
    //     console.log('aaaaaaaaaaa', item.data.policies);
    //     this.model = { ...this.model, ...item.data };
    //
    //     this.arrayTemp = item.data.policies;
    //     this.count = item.data.policies.length;
    //   });
    // }
  }

  ngAfterViewInit() {
    // const policiesControl = this.adminUserRoleForm.get('policies');
  }

  submit() {
    console.log('this.model', this.model)
    if (this.model){
      if (this.model.totalLeave){
        this.model.tenantId = 'fc8cbf0d-083c-43ac-bd86-be2ef7d72f3d'
        this.model.totalLeave = +this.model.totalLeave
        this.context.completeWith(this.model);
      }
    }
  }

  cancel() {
    this.context.completeWith(false);
  }

}
