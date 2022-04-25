export interface Item {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface Permission {
  resource: Item;
  action: Item;
}

export interface PolicyItem {
  service: Item;
  permissions: Permission[];
  permissionRemoves: Permission[];
}

export interface Policy extends Item {
  policyItems: PolicyItem[];
}
