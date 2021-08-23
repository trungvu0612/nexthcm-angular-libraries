import { Status } from './status';
import { Transition } from './transition';

export enum CellType {
  Status,
  Transition,
}

export type SelectedCell = { type: CellType.Status; cell: Status } | { type: CellType.Transition; cell: Transition };
