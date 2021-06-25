import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { SearchTenant, Tenant } from '../../models/tenant';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {TenantService} from '../../services/tenant.service';

@Component({
  selector: 'hcm-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService]
})
export class TenantListComponent implements OnInit {
  searchTenant = new BehaviorSubject<SearchTenant>({ name: '' });
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);
  data: Partial<Tenant>[] = [];
  columns = ['code', 'fullName', 'status', 'action'];

  constructor(
    private tenantService: TenantService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private destroy$: TuiDestroyService
  ) {}

  ngOnInit(): void {
    const request$ = combineLatest([this.page$, this.perPageSubject, this.searchTenant])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage, search]) => {
          return this.tenantService.getTenant(page - 1, perpage, search);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        console.log(item.data.items);
        this.data = item.data.items;
        this.totalLength = item.data.totalElements;
        this.cdr.detectChanges();
      });
  }
}
