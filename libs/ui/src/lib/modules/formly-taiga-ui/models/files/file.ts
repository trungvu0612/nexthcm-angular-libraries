import { TuiFileLike } from '@taiga-ui/kit';

export class RejectedFile {
  constructor(readonly file: TuiFileLike, readonly reason: string) {}
}
