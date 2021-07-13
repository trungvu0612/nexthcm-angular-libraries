import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { filterBySearch } from '@nexthcm/ui';
import { User } from '@nexthcm/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelpDeskService } from '../../services/help-desk.service';

@Component({
  selector: 'hcm-add-seat-dialog',
  templateUrl: './add-seat-dialog.component.html',
  styleUrls: ['./add-seat-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSeatDialogComponent {
  form = new FormGroup({});
  model: { user?: Partial<User> } = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'user',
      type: 'combo-box',
      templateOptions: {
        required: true,
        label: 'Search by CIF, Full Name',
        labelProp: 'username',
        subLabelProp: 'code',
        textfieldLabelOutside: false,
        stringify: (item: User) => item.username,
        serverRequest: (search: string): Observable<Partial<User>[]> =>
          this.helpDeskService.select('users').pipe(map((users) => filterBySearch<User>(users, search, 'username'))),
      },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<Partial<User> | null>,
    private helpDeskService: HelpDeskService
  ) {}

  close(): void {
    this.context.completeWith(null);
  }

  addSeat(): void {
    this.context.completeWith(this.model.user || null);
  }
}
