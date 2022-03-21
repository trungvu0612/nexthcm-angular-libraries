import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { BaseUser, EmployeesService } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { PushModule } from '@rx-angular/template';
import { TuiLetModule } from '@taiga-ui/cdk';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'hcm-mention-list',
  templateUrl: './mention-list.component.html',
  styleUrls: ['./mention-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class MentionListComponent {
  @Input() command!: (params: { id: string; label: string }) => void;
  readonly query$ = new Subject<string>();
  readonly items$ = this.state.select('items');
  readonly selectedIndex$ = this.state.select('selectedIndex');

  constructor(
    private readonly employeesService: EmployeesService,
    private readonly state: RxState<{ items: BaseUser[]; selectedIndex: number }>
  ) {
    this.state.set({ items: [], selectedIndex: 0 });
    this.state.connect(
      this.query$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((search) => this.employeesService.searchEmployees(search)),
        map((items) => ({ items, selectedIndex: 0 }))
      )
    );
  }

  @Input() set query(query: string) {
    this.query$.next(query);
  }

  selectItem(index: number): void {
    const { id, name } = this.state.get('items')[index];
    this.command({ id, label: name });
  }

  onKeyDown(event: KeyboardEvent): boolean {
    switch (event.key) {
      case 'ArrowUp':
        this.state.set(
          'selectedIndex',
          ({ items, selectedIndex }) => (selectedIndex + items.length - 1) % items.length
        );
        return true;
      case 'ArrowDown':
        this.state.set('selectedIndex', ({ items, selectedIndex }) => (selectedIndex + 1) % items.length);
        return true;
      case 'Enter':
        this.selectItem(this.state.get('selectedIndex'));
        return true;
      default:
        return false;
    }
  }
}

@NgModule({
  declarations: [MentionListComponent],
  imports: [CommonModule, PushModule, TuiLetModule],
  exports: [MentionListComponent],
})
export class MentionListComponentModule {}
