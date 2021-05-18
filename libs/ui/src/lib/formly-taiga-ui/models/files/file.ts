import { TuiFileLike } from '@taiga-ui/kit';

export class RejectedFile {
  constructor(readonly file: TuiFileLike, readonly reason: string) {}
}

export function isFile(file: any): file is File {
  return file instanceof File;
}

export function isRejectedFile(file: any): file is RejectedFile {
  return file instanceof RejectedFile;
}

export function convertRejected({ file, reason }: RejectedFile): TuiFileLike {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    content: reason,
  };
}
