import { Columns, Config } from 'ngx-easy-table';
import { Observable } from 'rxjs';

export interface ServerPaginationTableComponent<T> {
  configuration: Config;
  columns$: Observable<Columns[]>;
  loading$: Observable<boolean>;
  data$: Observable<T[]>;
  total$: Observable<number>;
}
