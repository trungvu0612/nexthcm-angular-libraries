import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { POLYMORPHEUS_CONTEXT, PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { UpsertJobTitleComponent } from '../upsert-job-title/upsert-job-title.component';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { AdminJobTitlesService } from '../../services/admin-job-titles.service';
import { JobTitle } from '../../models/job-title';

@Component({
  selector: 'hcm-list-job-title',
  templateUrl: './list-job-title.component.html',
  styleUrls: ['./list-job-title.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListJobTitleComponent implements OnInit {


  readonly columns = ['name', 'createdBy', 'description', 'createdDate', 'lastModifiedDate', 'state', 'action'];
  id!: string
  data: any = []

  page$ = new BehaviorSubject<number>(1);
  size$ = 10;

  perPageSubject = new BehaviorSubject<number>(this.size$);
  totalElements = 0;
  page = 0;
  size = 10;

  constructor(
    private adminJobTitlesService: AdminJobTitlesService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    // console.log(this.dataTest$.subscribe((data) => console.log('resssssss', data)));
    //
    const request$ = combineLatest([this.page$, this.perPageSubject])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage]) => {
          return this.adminJobTitlesService.getAdminJobTitles(page - 1, perpage);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        this.data = item.data.items;
        console.log('dataa', this.data);
        this.totalElements = item.data.totalElements;
        this.cdr.detectChanges();
      });
  }

  showDialog(): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertJobTitleComponent, this.injector), {
        // data: id,
      })
      .subscribe((result) => {
        if (result) {
          console.log('dataaaaaaa', result);
          this.adminJobTitlesService.createAdminJobTitleId(result).subscribe((data) => {
            console.log('Success Post');
          });
        }
      });
  }

  showDialogEdit(id: string): void {
    this.id = id
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertJobTitleComponent, this.injector), {
        data: this.id,
      })
      .subscribe((result) => {
        if (result) {
          this.adminJobTitlesService.editAdminJobTitleId(this.id, result).subscribe((data) => {
            console.log('Edit Edit');
          });
        }
      });
  }

  onPage(page: number) {
    this.page$.next(page + 1);
  }

  onSize(size: number) {
    this.perPageSubject.next(size);
  }

  cancel(): void {
    console.log('cancel');
  }
}
