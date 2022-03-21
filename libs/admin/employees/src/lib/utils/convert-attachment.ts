import { Attachment } from '@nexthcm/cdk';

export function convertAttachment(path: string): Attachment {
  const arr = path.split('/');

  return {
    file: { name: arr[arr.length - 1] },
    path,
  };
}
