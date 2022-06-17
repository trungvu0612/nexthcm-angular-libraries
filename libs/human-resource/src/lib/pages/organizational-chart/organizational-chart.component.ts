import { AfterViewInit, ChangeDetectionStrategy, Component, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { OrganizationalChartNodeComponent } from '../../components/organizational-chart-node/organizational-chart-node.component';
import { HumanResourceService } from '../../services/human-resource.service';

@Component({
  selector: 'hcm-organizational-chart',
  templateUrl: './organizational-chart.component.html',
  styleUrls: ['./organizational-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class OrganizationalChartComponent implements AfterViewInit {
  @ViewChildren(OrganizationalChartNodeComponent) nodes!: QueryList<OrganizationalChartNodeComponent>;
  readonly form = new UntypedFormGroup({});
  readonly model = {};
  readonly fields = [
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
  private readonly request$ = this.userId$.pipe(
    distinctUntilChanged(),
    switchMap((userId) =>
      this.humanResourceService.getOrgChartByUserId(userId).pipe(
        map((orgChart) => [orgChart]),
        startWith(null),
        catchError(() => of([]))
      )
    ),
    share()
  );
  readonly data$ = this.request$.pipe(filter(isPresent));
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    private readonly humanResourceService: HumanResourceService,
    private readonly destroy$: TuiDestroyService
  ) {}

  ngAfterViewInit(): void {
    this.form.controls['user'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => this.userId$.next(user?.id));

    this.nodes.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe((nodes: QueryList<OrganizationalChartNodeComponent>) => {
        const node: Element | undefined = nodes.find((node) => node.node.id === this.userId$.value)?.elementRef
          ?.nativeElement;

        node?.scrollIntoView({ block: 'center', inline: 'center' });
      });
  }
}
