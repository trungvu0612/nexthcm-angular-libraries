import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainTenantDataTableComponent } from './domain-tenant-data-table.component';

describe('DomainTenantDataTableComponent', () => {
  let component: DomainTenantDataTableComponent;
  let fixture: ComponentFixture<DomainTenantDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainTenantDataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainTenantDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
