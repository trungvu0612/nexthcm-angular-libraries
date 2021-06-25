export interface Tenant {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  tenantCode: string;
  tenantName: string;
  state: number;
}

export interface SearchTenant {
  name: string;
}

export interface DomainTenantData {
  id: string;
  logo?: string;
  title?: string;
  status?: string;
}
