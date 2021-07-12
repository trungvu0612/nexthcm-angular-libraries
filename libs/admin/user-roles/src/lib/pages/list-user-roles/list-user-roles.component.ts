import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { UpsertUserRolesComponent } from '../upsert-user-roles/upsert-user-roles.component';

@Component({
  selector: 'hcm-list-user-roles',
  templateUrl: './list-user-roles.component.html',
  styleUrls: ['./list-user-roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListUserRolesComponent implements OnInit {
  constructor(private dialogService: TuiDialogService, private injector: Injector) {}

  ngOnInit(): void {}

  showDialog(): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertUserRolesComponent, this.injector), {
        size: 'l',
        // data: id,
      })
      .subscribe((data) => {
        // if (data) {
        //   const body = {
        //     status: 0,
        //   };
        //   // this.myLeaveService.editLeave(id, body).subscribe((data) => {
        //   //   console.log('susscess edit', id);
        //   // });
        // }
      });
  }
}
