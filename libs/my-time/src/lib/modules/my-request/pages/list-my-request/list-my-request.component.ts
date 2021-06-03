import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject } from 'rxjs';
import { Requests, SearchRequest } from '../../../../models/requests';
import { MyRequestService } from '../../../../services/my-request.service';
import { RequestsDialogComponent } from '../../components/requests-dialog/requests-dialog.component';

@Component({
  selector: 'hcm-list-my-request',
  templateUrl: './list-my-request.component.html',
  styleUrls: ['./list-my-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListMyRequestComponent implements OnInit {
  leaveTypes!: Requests[];
  readonly columns = ['type', 'fromDate', 'toDate', 'reason', 'action'];
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);
  perPage$ = this.perPageSubject.asObservable();
  searchSubject = new BehaviorSubject<SearchRequest>({ type: '' });
  searchForm!: FormGroup<SearchRequest>;

  constructor(
    private myRequestService: MyRequestService,
    private formBuilder: FormBuilder,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {

  }

  onPage(page: number) {
    this.page$.next(page + 1);
  }

  onSize(size: number) {
    this.perPageSubject.next(size);
  }

  onSearch(): void {
    this.searchSubject.next(this.searchForm.getRawValue());
  }

  cancel(): void {
    console.log('cancel');
  }

  showDialog(): void {
    const title = 'Title';
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(RequestsDialogComponent, this.injector), {
        closeable: false,
        data: { title }
      })
      .subscribe((cancel) => {
        if (cancel) this.cancel();
      });
  }
}
