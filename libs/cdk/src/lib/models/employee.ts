import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { TuiFileLike } from '@taiga-ui/kit';

import { CommonStatus, EmployeeCurrentStatus } from '../enums';
import { BaseObject, BaseUser } from './base-object';
import { DateRange } from './date-range';

export type EmployeeInformationAPIType =
  | 'INDIVIDUAL'
  | 'DURATION'
  | 'EDUCATION'
  | 'WORK_EXPERIENCE'
  | 'PIT'
  | 'SHUI'
  | 'FAMILY_BOOK'
  | 'LABOR_CONTRACT'
  | 'RESIGNATION_LEAVE'
  | 'HEALTH_CARE'
  | 'ATTACHMENT';
export type EmployeeInformationType =
  | EmployeeIndividual
  | EmployeeDuration
  | EmployeeEducation
  | EmployeeExperience
  | EmployeePIT
  | EmployeeSHUI
  | EmployeeFamilyBook
  | EmployeeLaborContract
  | EmployeeResignationLeave
  | EmployeeHealthCare
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
  organization: BaseObject;
  roles: BaseObject[];
  jobTitle?: BaseObject;
  jobLevel?: BaseObject;
  directReport: BaseUser;
  office: BaseObject;
  addressPersonal: EmployeeAddress;
  syncLDAPDirectReport: boolean;
  statusBoolean?: boolean;
  userMultipleReportMethod: Supervisor[];
  vCode: string;
  site: string;
  teamSection: string;
  sector: string;
  costCenter: string;
  vnJobTitle: string;
  workingPlace: string;
  accountCustomer: string;
  RCS: string;
  staffCategory: string;
  seniorityDate: string | TuiDay | Date;
  BVTime: string;
  startWorkingDay: string | TuiDay | Date;
  lastWorkingDay: string | TuiDay | Date;
  attachmentFiles: string[];
  attachments?: Attachment[];
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
  employmentContractTerminationDate?: string;
  indefiniteTermContract?: string;
  indefiniteTermContractDate?: string | TuiDay | Date;
  resignationAgreement?: string;
  resignationAgreementDate?: string | TuiDay | Date;
}

export interface EmployeeEducation extends EmployeeBaseForm {
  certificates?: Certificate[];
}

export interface EmployeeExperience extends EmployeeBaseForm {
  experience?: Experience[];
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

export interface Experience {
  company?: string;
  jobTitle?: string;
  fromDate?: string;
  toDate?: string;
  description?: string;
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
  siNumber: string;
  hospitalCode: string;
  hospitalName: string;
  attachmentFiles: string[];
  attachments?: Attachment[];
}

export interface EmployeePIT extends EmployeeBaseForm {
  taxCode: string;
  noOfDependant: number;
  attachmentFiles: string[];
  attachments?: Attachment[];
}

export interface EmployeePersonal extends EmployeeBaseForm {
  taxCode: string;
  noOfDependant: number;
  attachmentFiles: string[];
  attachments?: Attachment[];
}

export interface EmployeeHealthCare extends EmployeeBaseForm {
  healthCareNumber: string;
  startDate: string | TuiDay | Date;
  noOfDependantPaidByEmployer: string;
  healthCareLevel: string;
  noOfDependantPaidByEmployee: string;
  attachmentFiles: string[];
  attachments?: Attachment[];
}

export interface EmployeeResignationLeave extends EmployeeBaseForm {
  resignationReasons: string;
  startDateOfUnpaidLeave: string | TuiDay | Date;
  typeOfUnpaidLeave: string;
  remarkOfUnpaidLeave: string;
  noOfTerminationDecision: string;
  backdatedAfterUnpaidLeave: string | TuiDay | Date;
  attachmentFiles: string[];
  attachments?: Attachment[];
}

export interface EmployeeLaborContract extends EmployeeBaseForm {
  probationStartDate: string | TuiDay | Date;
  probationEndDate: string | TuiDay | Date;
  firstLaborContractStartDate: string | TuiDay | Date;
  firstLaborContractEndDate: string | TuiDay | Date;
  secondLaborContractStartDate: string | TuiDay | Date;
  secondLaborContractEndDate: string | TuiDay | Date;
  probationStindefiniteTermLaborContractStartDateartDate: string | TuiDay | Date;
  currentTypeOfContract: string;
  attachmentFiles: string[];
  attachments?: Attachment[];
}

export interface EmployeeFamilyBook extends EmployeeBaseForm {
  familyBookNumber: string;
  familyBookOwnerName: string;
  familyBookOwnerBirthday: string | TuiDay | Date;
  familyBookOwnerId: string;
  ownerGender: string;
  relationshipOwnerEmployee: string;
  attachmentFiles: string[];
  attachments?: Attachment[];
}

export interface EmployeeManagement extends EmployeeBaseForm {
  subLeader: string;
  directManager: string;
  upperManager: string | TuiDay | Date;
  hod: string;
  hrbp: string;
  pjc: string;
  attachmentFiles: string[];
  attachments?: Attachment[];
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
