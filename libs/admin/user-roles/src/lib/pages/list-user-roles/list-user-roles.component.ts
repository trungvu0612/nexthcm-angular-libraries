import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { UpsertUserRolesComponent } from '../upsert-user-roles/upsert-user-roles.component';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { AdminUserRolesService } from '../../services/admin-user-roles.service';
import { TuiDestroyService } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-list-user-roles',
  templateUrl: './list-user-roles.component.html',
  styleUrls: ['./list-user-roles.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListUserRolesComponent implements OnInit {

  readonly columns = ['name', 'description', 'action'];
  id!: string;
  data: any = [];

  page$ = new BehaviorSubject<number>(1);
  size$ = 10;

  perPageSubject = new BehaviorSubject<number>(this.size$);
  totalElements = 0;
  page = 0;
  size = 10;


  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private adminUserRolesService: AdminUserRolesService,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    const request$ = combineLatest([this.page$, this.perPageSubject])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage]) => {
          return this.adminUserRolesService.getAdminUserRoles(page - 1, perpage);
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
      .open<boolean>(new PolymorpheusComponent(UpsertUserRolesComponent, this.injector), {
        size: 'l',
        // data: id,
      })
      .subscribe((result) => {
        if (result) {
          console.log('dataaaaaaa', result);
          this.adminUserRolesService.createAdminUserRoleId(result).subscribe((data) => {
            console.log('Success Post');
          });
        }
      });
  }

  showDialogEdit(id: string): void {
    this.id = id;
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertUserRolesComponent, this.injector), {
        size: 'l',
        data: this.id,
      })
      .subscribe((result) => {
        if (result) {
          this.adminUserRolesService.editAdminUserRoleId(this.id, result).subscribe((data) => {
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
