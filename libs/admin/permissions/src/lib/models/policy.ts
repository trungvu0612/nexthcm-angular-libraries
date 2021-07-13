import { AbstractControl } from '@ngneat/reactive-forms';

export interface Item {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface Resource extends Item {
  resourceId: string;
}

export interface Action extends Item {
  resources: Resource[];
}

export interface Permission {
  id: string;
  resource: Resource | Resource[];
  action: Action;
}

export interface Service extends Item {
  serviceId: string;
}

export interface PolicyItem {
  id: string;
  service: Service;
  permissions: Permission[];
  permissionRemoves: Permission[];
}

export interface Policy extends Item {
  code: string;
  lastModifiedDate: number;
  policyItems: PolicyItem[];
}

export interface PermissionForm {
  action: Partial<Action>;
  resource: Partial<Resource>[];
  resourcesForm?: AbstractControl<Partial<Resource>[]>;
}
