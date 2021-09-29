import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { EmployeeCurrentStatus } from '../enums';
import { DateRange } from './date-range';

export type EmployeeInformationAPIType = 'individual' | 'duration' | 'education' | 'shui';
export type EmployeeInformationType = EmployeeIndividual | EmployeeDuration | EmployeeEducation | EmployeeSHUI;

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

export interface EmployeeIndividual {
  employeeId: string;
  type: EmployeeInformationAPIType;
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

export interface EmployeeDuration {
  type: EmployeeInformationAPIType;
  emergencyContacts?: EmergencyContact[] | string;
  employeeId?: string;
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

export interface EmployeeEducation {
  employeeId: string;
  type: EmployeeInformationAPIType;
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

export interface EmployeeSHUI {
  employeeId: string;
  type: EmployeeInformationAPIType;
  taxIDNumber: string;
  socialInsuranceNumber: string;
  socialInsurancePlace: string;
  familyHealthyCareNumber: string;
  familyAllowance: string;
  healthInsuranceNumber: string;
  healthCares: HealthCare[] | string;
}

export interface EmployeeAddress {
  address: string;
  countryId: string;
  cityId: string;
  districtId: string;
  wardId: string;
  postalCode: string;
}
