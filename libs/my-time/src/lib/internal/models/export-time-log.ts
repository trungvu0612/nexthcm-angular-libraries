import { Control } from '@ng-stack/forms';
import { TuiDayRange } from '@taiga-ui/cdk';

import { ExportTimeLogType } from '../enums';

export interface ExportTimeLog {
  dateRange: Control<TuiDayRange>;
  exportType: ExportTimeLogType;
  filterByMyTeam: boolean;
}
