import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { TuiDialogService } from '@taiga-ui/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { UpsertLeaveLevelApproveComponent } from '../upsert-leave-level-approve/upsert-leave-level-approve.component';
import { LevelApproveService } from '../../services/level-approve.service';

@Component({
  selector: 'hcm-list-leave-level-approve',
  templateUrl: './list-leave-level-approve.component.html',
  styleUrls: ['./list-leave-level-approve.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListLeaveLevelApproveComponent implements OnInit {

  readonly columns = ['name', 'leaveType.name', 'createdDate', 'totalLeave', 'action'];
  data: any = [];

  page$ = new BehaviorSubject<number>(1);
  size$ = 10;

  perPageSubject = new BehaviorSubject<number>(this.size$);
  totalElements = 0;
  page = 0;
  size = 10;

  constructor(
    private levelApproveService: LevelApproveService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    const request$ = combineLatest([this.page$, this.perPageSubject])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage]) => {
          return this.levelApproveService.getAdminLevelApproves(page - 1, perpage);
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
      .open<boolean>(new PolymorpheusComponent(UpsertLeaveLevelApproveComponent, this.injector), {})
      .subscribe((result) => {
        if (result) {
          console.log('dataaaaaaa', result);
          this.levelApproveService.createAdminLevelApproveId(result).subscribe((data) => {
            console.log('Success Post');
          });
        }
      });
  }

  // showDialogEdit(id: string): void {
  //   this.dialogService
  //     .open<boolean>(new PolymorpheusComponent(UpsertLeaveLevelApproveComponent, this.injector), {
  //       data: this.levelApproveService.getAdminLevelApproveId(id)
  //     })
  //     .subscribe((result) => {
  //       if (result) {
  //         this.levelApproveService.editAdminLevelApproveId(id, result).subscribe((data) => {
  //           console.log('Edit Edit');
  //         });
  //       }
  //     });
  // }

  onPage(page: number) {
    this.page$.next(page + 1);
  }

  onSize(size: number) {
    this.perPageSubject.next(size);
  }

  delete(id: string): void {
    if (id) {
      this.levelApproveService.deleteAdminLevelApproveId(id).subscribe((data) => {
        console.log('Delete sucesss');
      });
    }
  }

  sort() {
  }

}
