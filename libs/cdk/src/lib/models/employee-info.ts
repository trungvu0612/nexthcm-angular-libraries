import { BaseObject } from './base-object';

export interface EmployeeInfo {
  id: string;
  cif: string;
  registerType: string;
  profileType: string;
  registration: number;
  username: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  image: string;
  status: number;
  organization: BaseObject;
  roles: BaseObject[];
  jobTitle: BaseObject;
  jobLevel?: BaseObject;
  directReport: BaseObject;
  fullName: string;
}
