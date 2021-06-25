export interface Permission {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  policyId: string;
  code: string;
  name: string;
  description: string;
  tenantId: string;
  policyItems: any[];
}
