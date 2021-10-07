import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FileObjectsState, FileObjectsStore } from './file-objects.store';

@Injectable({ providedIn: 'root' })
export class FileObjectsQuery extends QueryEntity<FileObjectsState> {
  constructor(protected store: FileObjectsStore) {
    super(store);
  }
}
