import { BaseObject } from '@nexthcm/cdk';

export interface EmployeeNode {
  id: string;
  fullName: string;
  organization: EmployeeNodeOrganization;
  jobTitle: BaseObject;
  profile: EmployeeNodeProfile;
  reportTo: EmployeeNodeReportTo;
  descendants: EmployeeNode[];
}

export interface EmployeeNodeOrganization {
  id: string;
  orgName: string;
}

export interface EmployeeNodeProfile {
  image: string;
  phone: string;
  personalEmail: string;
  companyEmail: string;
}

export interface EmployeeNodeReportTo {
  id: string;
  fullName: string;
  image: string;
  jobTitle?: BaseObject;
}
