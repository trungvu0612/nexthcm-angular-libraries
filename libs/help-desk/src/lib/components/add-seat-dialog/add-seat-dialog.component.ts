import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UserDto } from '@nexthcm/core';
import { filterBySearch } from '@nexthcm/ui';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelpDeskService } from '../../services/help-desk.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'hcm-add-seat-dialog',
  templateUrl: './add-seat-dialog.component.html',
  styleUrls: ['./add-seat-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSeatDialogComponent {
  readonly form = new FormGroup({});
  model: { user?: Partial<UserDto> } = {};
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'user',
      type: 'combo-box',
      templateOptions: {
        required: true,
        translate: true,
        label: 'chooseUser',
        labelProp: 'username',
        subLabelProp: 'code',
        stringify: (item: UserDto) => item.username,
        serverRequest: (search: string): Observable<Partial<UserDto>[]> =>
          this.helpDeskService.select('users').pipe(map((users) => filterBySearch<UserDto>(users, search, 'username'))),
      },
      validation: { messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') } },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<Partial<UserDto> | null>,
    private readonly helpDeskService: HelpDeskService,
    private readonly translocoService: TranslocoService
  ) {}

  cancel(): void {
    this.context.completeWith(null);
  }

  submit(): void {
    if (this.form.valid) {
      this.context.completeWith(this.model.user || null);
    }
  }
}
