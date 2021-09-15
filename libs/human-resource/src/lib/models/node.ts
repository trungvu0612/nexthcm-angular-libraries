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

export interface OrgChart {
  id: string;
  fullName: string;
  jobTitle?: JobTitle
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  tenant: Tenant;
  username: string;
  registerType: string;
  descendants: OrgChart[];
  reportTo?: ReportTo;
  profile?: Profile
}

export interface JobTitle {
  id: string;
  name: string;
}

export interface ReportTo {
  id: string;
  fullName: string;
  username: string;
}

export interface Profile {
  companyEmail: string;
  phone: string;
}

export interface SearchOrg {
  name: OrgChart;
}
