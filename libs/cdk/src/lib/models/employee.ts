import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { EmployeeCurrentStatus } from '../enums';
import { DateRange } from './date-range';

export type EmployeeInformationAPIType = 'INDIVIDUAL' | 'DURATION' | 'EDUCATION' | 'SHUI' | 'ATTACHMENT';
export type EmployeeInformationType =
  | EmployeeIndividual
  | EmployeeDuration
  | EmployeeEducation
  | EmployeeSHUI
  | EmployeeAttachment;

interface BaseOption {
  id: string;
  name: string;
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
  status: number;
  profileType: string;
  registerType: string;
  registration: number;
  organization: BaseOption;
  roles: BaseOption[];
  jobTitle?: BaseOption;
  jobLevel?: BaseOption;
  directReport: BaseOption;
  office: BaseOption;
  addressPersonal: EmployeeAddress;
}

export interface BankAccount {
  bank: string;
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
  office: BaseOption | string;
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
  university?: string;
  major?: string;
  highestCertificate?: string;
  graduationYear?: string;
  description?: string;
}

export interface HealthCare {
  healthcare: string;
  number: string;
}

export interface EmployeeSHUI extends EmployeeBaseForm {
  taxIDNumber: string;
  socialInsuranceNumber: string;
  socialInsurancePlace: string;
  familyHealthyCareNumber: string;
  familyAllowance: string;
  healthInsuranceNumber: string;
  healthCares: HealthCare[] | string;
}

export interface EmployeeAddress {
  address1: string;
  countryId: string;
  cityId: string;
  districtId: string;
  wardId: string;
  postalCode: string;
}

export interface EmployeeAttachment extends EmployeeBaseForm {
  attachmentFiles: string[];
}
