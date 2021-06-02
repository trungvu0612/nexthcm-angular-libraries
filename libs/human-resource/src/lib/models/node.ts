export interface Node {
  id: number;
  name: string;
  job: string;
  img?: string | undefined;
  children?: Node[];
}

export interface Tenant {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  tenantCode: string;
  tenantName: string;
  state: number;
}

export interface OrgRes {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id?: string;
  tenant: Tenant;
  username: string;
  registerType: string;
  descendants: OrgRes[];
}
