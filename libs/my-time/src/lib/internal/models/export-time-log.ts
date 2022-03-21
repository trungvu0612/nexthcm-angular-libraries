import { TuiDayRange } from '@taiga-ui/cdk';

import { ExportTimeLogType } from '../enums';

export interface ExportTimeLog {
  dateRange: TuiDayRange;
  exportType: ExportTimeLogType;
  filterByMyTeam: boolean;
}
