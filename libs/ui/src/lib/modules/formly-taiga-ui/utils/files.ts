import { TuiFileLike } from '@taiga-ui/kit';

import { RejectedFile } from '../models';

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

export function convertFile(file: File): TuiFileLike {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
  };
}
