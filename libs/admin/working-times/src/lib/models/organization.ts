export interface Organization {
	createdDate: number;
	createdBy: string;
	lastModifiedDate: number;
	lastModifiedBy: string;
	optCounter: number;
	id: string;
	state: number;
	member: OrganizationMember;
	orgType: string;
	orgName: string;
	code: string;
	tenant: OrganizationTenant;
	descendants: OrganizationDescendants[];
}
export interface OrganizationMember {
	id: string;
	type: string;
}
export interface OrganizationTenant {
	id: string;
	username: string;
	tenantCode: string;
	tenantName: string;
	state: number;
	tax: string;
	website: string;
	email: string;
	phone: string;
	addressId: string;
	shortname: string;
	hasLDAPUser: boolean;
}
export interface OrganizationDescendantsMember {
	id: string;
	type: string;
}
export interface OrganizationDescendantsTenant {
	id: string;
	username: string;
	tenantCode: string;
	tenantName: string;
	state: number;
	tax: string;
	website: string;
	email: string;
	phone: string;
	addressId: string;
	shortname: string;
	hasLDAPUser: boolean;
}
export interface OrganizationDescendants {
	createdDate: number;
	createdBy: string;
	lastModifiedDate: number;
	lastModifiedBy: string;
	optCounter: number;
	id: string;
	state: number;
	member: OrganizationDescendantsMember;
	orgType: string;
	orgName: string;
	code: string;
	tenant: OrganizationDescendantsTenant;
}
