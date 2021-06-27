import { AbstractControl } from '@ngneat/reactive-forms';

export interface Item {
  code: string;
  name: string;
  description: string;
}

export interface Resource extends Item {
  resourceId: string;
  actionId: string;
}

export interface Action extends Item {
  actionId: string;
  resources: Resource[];
}

export interface Permission {
  permissionId: string;
  resource: Resource | Resource[];
  action: Action;
}

export interface Service extends Item {
  serviceId: string;
}

export interface PolicyItem {
  policyItemId: string;
  service: Service;
  permissions: Permission[];
}

export interface Policy extends Item {
  policyId: string;
  policyItems: PolicyItem[];
}

export interface PermissionForm {
  action: Partial<Action>;
  resource: Partial<Resource>[];
  resourcesForm?: AbstractControl<Partial<Resource>[]>;
}
