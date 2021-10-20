import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { HumanResourceService } from '../../services/human-resource.service';

interface SearchForm {
  userId: string | null;
}

@Component({
  selector: 'hcm-organizational-chart',
  templateUrl: './organizational-chart.component.html',
  styleUrls: ['./organizational-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class OrganizationalChartComponent implements OnInit {
  searchForm = this.fb.group<SearchForm>({ userId: '' });
  model = { userId: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'userId',
      className: 'w-72',
      type: 'user-combo-box',
      templateOptions: {
        translate: true,
        labelClassName: 'font-semibold',
        placeholder: 'searchUsers',
        valueProp: 'id',
        textfieldLabelOutside: true,
      },
    },
  ];
  readonly userId$ = new BehaviorSubject<string | null>(null);
  private readonly request$ = this.userId$.pipe(
    distinctUntilChanged(),
    switchMap((userId) =>
      this.humanResourceService.getOrgChartByUserId(userId).pipe(
        map((orgChart) => [orgChart]),
        startWith(null)
      )
    ),
    share()
  );
  readonly data$ = this.request$.pipe(filter(isPresent));
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    private readonly fb: FormBuilder,
    private readonly humanResourceService: HumanResourceService,
    private readonly destroy$: TuiDestroyService
  ) {}

  ngOnInit(): void {
    this.searchForm.controls.userId.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((userId) => this.userId$.next(userId));
  }
}
