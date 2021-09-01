import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Image } from './image.model';

export interface ImagesState extends EntityState<Image, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'images' })
export class ImagesStore extends EntityStore<ImagesState> {
  constructor() {
    super();
  }
}
