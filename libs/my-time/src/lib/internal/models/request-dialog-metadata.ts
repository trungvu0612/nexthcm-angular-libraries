import { Type } from '@angular/core';

export interface RequestDialogMetadata {
  [p: string]: {
    component: Type<any>;
    label: string;
    route?: string;
  };
}
