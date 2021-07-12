export interface EmployeeGeneralInformation {
  [x: string]: any;
}

export interface EmployeeIndividual {
  [x: string]: any;
}

export interface EmployeeDuration {
  [x: string]: any;
}

export interface EmployeeEducation {
  [x: string]: any;
}

export interface EmployeeSHUI {
  [x: string]: any;
}

export interface Employee
  extends EmployeeGeneralInformation,
    EmployeeIndividual,
    EmployeeDuration,
    EmployeeEducation,
    EmployeeSHUI {}
