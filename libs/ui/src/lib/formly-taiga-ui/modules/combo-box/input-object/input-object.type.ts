import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'formly-input-object',
  templateUrl: './input-object.type.html',
  styleUrls: ['./input-object.type.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputObjectComponent extends FieldType implements OnInit {
  search$ = new BehaviorSubject('');
  items$!: Observable<any[]>;
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldLabelOutside: true,
      textfieldCleaner: true,
      stringify: (item: any) => item.name || '',
    },
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.items$ = combineLatest([this.to.options as Observable<any[]>, this.search$]).pipe(
      map(([items, search]) =>
        items.filter((item) => {
          return item.name ? item.name.toLowerCase().indexOf(search.toLowerCase()) > -1 : false;
        })
      )
    );
  }
}
