import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { FileObject } from './file-object.model';

export type FileObjectsState = EntityState<FileObject, string>

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'file-objects' })
export class FileObjectsStore extends EntityStore<FileObjectsState> {
  constructor() {
    super();
  }
}
