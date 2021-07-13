import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';

export interface Tabs {
  root: string;
  tabs: { path: string; tabName: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class HeaderService extends RxState<Tabs> {
  constructor() {
    super();
    this.initState();
  }

  initState(): void {
    this.set({ root: '', tabs: [] });
  }
}
