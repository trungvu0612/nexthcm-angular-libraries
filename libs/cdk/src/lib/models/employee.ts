import { Control } from '@ng-stack/forms';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { TuiFileLike } from '@taiga-ui/kit';

import { CommonStatus, EmployeeCurrentStatus } from '../enums';
import { BaseObject, BaseUser } from './base-object';
import { DateRange } from './date-range';

export type EmployeeInformationAPIType = 'INDIVIDUAL' | 'DURATION' | 'EDUCATION' | 'SHUI' | 'ATTACHMENT';
export type EmployeeInformationType =
  | EmployeeIndividual
  | EmployeeDuration
  | EmployeeEducation
  | EmployeeSHUI
  | EmployeeAttachment;

export interface Supervisor {
  method: BaseObject;
  userReports: BaseUser[];
}

export interface EmployeeGeneralInformation {
  id: string;
  fullName: string;
  cif: string;
  username: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  image?: string;
  status: CommonStatus;
  profileType: string;
  registerType: string;
  registration: number;
  organization: Control<BaseObject>;
  roles: Control<BaseObject[]>;
  jobTitle?: Control<BaseObject>;
  jobLevel?: Control<BaseObject>;
  directReport: Control<BaseUser>;
  office: Control<BaseObject>;
  addressPersonal: Control<EmployeeAddress>;
  syncLDAPDirectReport: boolean;
  statusBoolean?: boolean;
  userMultipleReportMethod: Supervisor[];
}

export interface BankAccount {
  bank: string;
  bankBranch: string;
  number: number;
}

export interface EmployeeBaseForm {
  employeeId: string;
  type: EmployeeInformationAPIType;
}

export interface EmployeeIndividual extends EmployeeBaseForm {
  permanentAddress: EmployeeAddress;
  temporaryAddress: EmployeeAddress;
  gender: string;
  birthDate: string | TuiDay | Date;
  idNumber: number;
  issueOn: string | TuiDay | Date;
  issueAt: string;
  currentStatus: EmployeeCurrentStatus;
  companyEmail: string;
  personalEmail: string;
  phoneNumber: number;
  bankAccounts: BankAccount[] | string;
  office: BaseObject | string;
  officeOnsite?: string;
  maritalStatus: string;
  religion: string;
  nationality: string;
  section: string;
}

export interface EmergencyContact {
  phoneNumber: string;
  relationship: string;
}

export interface EmployeeDuration extends EmployeeBaseForm {
  emergencyContacts?: EmergencyContact[] | string;
  onboardDate?: string | TuiDay | Date;
  probationDate?: DateRange | TuiDayRange | string;
  officialStartDate?: string | TuiDay | Date;
  terminationDate?: string | TuiDay | Date;
  probationNumber?: number;
  labourContractNumber?: string;
  labourContractDate?: string | TuiDay | Date;
  indefiniteTermContract?: string;
  indefiniteTermContractDate?: string | TuiDay | Date;
  resignationAgreement?: string;
  resignationAgreementDate?: string | TuiDay | Date;
}

export interface EmployeeEducation extends EmployeeBaseForm {
  certificates?: Certificate[];
}

export interface Certificate {
  university?: string;
  major?: string;
  highestCertificate?: string;
  graduationYear?: string;
  score?: string;
  startDate?: string | TuiDay | Date;
  endDate?: string | TuiDay | Date;
}

export interface HealthCare {
  healthcare: string;
  number: string;
}

export interface DependentMember {
  nameDependenceMember: string;
  birthDateDependenceMember: string;
  idNumberDependenceMember: string;
  issueOnDependenceMember: string;
  issueAtDependenceMember: string;
}

export interface EmployeeSHUI extends EmployeeBaseForm {
  taxIDNumber: string;
  socialInsuranceNumber: string;
  socialInsurancePlace: string;
  familyHealthyCareNumber: string;
  healthInsuranceNumber: string;
  healthCares: HealthCare[] | string;
  dependenceMembers: DependentMember[] | string;
}

export interface EmployeeAddress {
  address1: string;
  countryId: string;
  cityId: string;
  districtId: string;
  wardId: string;
  postalCode: string;
}

export interface Attachment {
  file: TuiFileLike;
  path: string;
}

export interface EmployeeAttachment extends EmployeeBaseForm {
  attachmentFiles: string[];
  attachments?: Attachment[];
}
