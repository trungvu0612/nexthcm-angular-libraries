import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BaseUser } from '@nexthcm/cdk';
import { Control, FormBuilder } from '@ng-stack/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { OrganizationalChartNodeComponent } from '../../components/organizational-chart-node/organizational-chart-node.component';
import { EmployeeNode } from '../../models/employee-node';
import { HumanResourceService } from '../../services/human-resource.service';

interface SearchForm {
  user: Control<BaseUser>;
}

@Component({
  selector: 'hcm-organizational-chart',
  templateUrl: './organizational-chart.component.html',
  styleUrls: ['./organizational-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class OrganizationalChartComponent implements OnInit, AfterViewInit {
  @ViewChildren(OrganizationalChartNodeComponent) nodes!: QueryList<OrganizationalChartNodeComponent>;

  model = { user: null } as SearchForm;
  searchForm = this.fb.group<SearchForm>(this.model);
  fields: FormlyFieldConfig[] = [
    {
      key: 'user',
      className: 'w-72',
      type: 'user-combo-box',
      templateOptions: {
        translate: true,
        labelClassName: 'font-semibold',
        placeholder: 'searchUsers',
        textfieldLabelOutside: true,
      },
    },
  ];
  readonly userId$ = new BehaviorSubject<string | undefined>(undefined);
  private readonly request$: Observable<EmployeeNode[] | null> = this.userId$.pipe(
    distinctUntilChanged(),
    switchMap((userId) =>
      this.humanResourceService.getOrgChartByUserId(userId).pipe(
        map((orgChart) => [orgChart]),
        catchError(() => of([])),
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
    this.searchForm.controls.user.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => this.userId$.next(user?.id));
  }

  ngAfterViewInit(): void {
    this.nodes.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe((nodes: QueryList<OrganizationalChartNodeComponent>) => {
        const node: Element | undefined = nodes.find((node) => node.node.id === this.userId$.value)?.elementRef
          ?.nativeElement;

        node?.scrollIntoView({ block: 'center', inline: 'center' });
      });
  }
}
