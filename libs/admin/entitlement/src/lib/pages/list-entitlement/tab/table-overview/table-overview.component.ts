// import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
// import { FormControl } from '@ngneat/reactive-forms';
// import { TuiDestroyService } from '@taiga-ui/cdk';
// import { TuiDialogService } from '@taiga-ui/core';
// import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
// import { BehaviorSubject, combineLatest } from 'rxjs';
// import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
// import { LeaveStatus } from '../../../../enums/status';
// import { AdminEntitlementService } from '../../../../services/admin-entitlement.service';
// import { CreateLeaveEntitlementComponent } from '../../dialog/create-leave-entitlement/create-leave-entitlement.component';
// import { EditLeaveEntitlementComponent } from '../../dialog/edit/edit-leave-entitlement/edit-leave-entitlement.component';
//
// @Component({
//   selector: 'hcm-table-overview-entitlement',
//   templateUrl: './table-overview.component.html',
//   styleUrls: ['./table-overview.component.scss'],
//   providers: [TuiDestroyService],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class TableOverviewComponent implements OnInit {
//
//   readonly LeaveStatus = LeaveStatus;
//
//   dateControl = new FormControl<Date>();
//   columns = ['period.name', 'leaveType', 'entitlement', 'status', 'action'];
//
//   data: any = [];
//   page$ = new BehaviorSubject<number>(1);
//   size$ = 10;
//
//   perPageSubject = new BehaviorSubject<number>(this.size$);
//   totalElements = 0;
//   page = 0;
//   size = 10;
//
//   constructor(
//     private adminEntitlementService: AdminEntitlementService,
//     private dialogService: TuiDialogService,
//     private injector: Injector,
//     private destroy$: TuiDestroyService,
//     private cdr: ChangeDetectorRef
//   ) {
//   }
//
//   ngOnInit(): void {
//     const request$ = combineLatest([this.page$, this.perPageSubject])
//       .pipe(
//         debounceTime(0),
//         switchMap(([page, perpage]) => {
//           return this.adminEntitlementService.getAdminEntitlements(page - 1, perpage);
//         }),
//         takeUntil(this.destroy$)
//       )
//       .subscribe((item) => {
//         this.data = item.data.items;
//         this.totalElements = item.data.totalElements;
//         this.cdr.detectChanges();
//       });
//   }
//
//   cancel(): void {
//   }
//
//   onPage($event: number) {
//     this.page$.next($event);
//   }
//
//   onSize($event: number) {
//     this.size$ = $event;
//   }
//
//   showDialogSubmit() {
//     this.dialogService
//       .open<boolean>(new PolymorpheusComponent(CreateLeaveEntitlementComponent, this.injector), {})
//       .subscribe((result) => {
//         if (result) {
//           this.adminEntitlementService.createAdminEntitlementOrg(result).subscribe((data) => {
//           });
//         }
//       });
//   }
//
//   showDialogEdit(id: string) {
//     this.dialogService
//       .open<boolean>(new PolymorpheusComponent(EditLeaveEntitlementComponent, this.injector), {
//         data: id
//       })
//       .subscribe((result) => {
//         if (result) {
//           console.log('ngoaiiii', result)
//           this.adminEntitlementService.editAdminEntitlementId(id,result).subscribe((data) => {
//           });
//         }
//       });
//   }
//
//   // showDialogEdit(id: string) {
//   //   this.dialogService
//   //     .open<boolean>(new PolymorpheusComponent(EditLeaveEntitlementComponent, this.injector), {
//   //       data: id
//   //     })
//   //     .subscribe((result) => {
//   //       if (result) {
//   //         console.log('dataaaaaaa', result);
//   //         this.adminEntitlementService.createAdminEntitlementOrg(result).subscribe((data) => {
//   //           console.log('Success Post');
//   //         });
//   //       }
//   //     });
//   // }
//
//   delete(id: string): void {
//     if (id) {
//       this.adminEntitlementService.deleteAdminEntitlementId(id).subscribe((data) => {
//       });
//     }
//   }
//
// }
