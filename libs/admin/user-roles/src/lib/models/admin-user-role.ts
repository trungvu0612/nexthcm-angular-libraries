export interface AdminUserRole {
  name?: string;
  description?: string;
  policy?: Policy;
}

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
  policyItems: PolicyItem[];
}
