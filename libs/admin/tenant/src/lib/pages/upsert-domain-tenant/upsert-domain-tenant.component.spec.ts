import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertDomainTenantComponent } from './upsert-domain-tenant.component';

describe('UpsertDomainTenantComponent', () => {
  let component: UpsertDomainTenantComponent;
  let fixture: ComponentFixture<UpsertDomainTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertDomainTenantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertDomainTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
