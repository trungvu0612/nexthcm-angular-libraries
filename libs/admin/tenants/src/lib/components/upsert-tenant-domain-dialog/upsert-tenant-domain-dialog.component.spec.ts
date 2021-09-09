import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertTenantDomainDialogComponent } from './upsert-tenant-domain-dialog.component';

describe('UpsertTenantDomainComponent', () => {
  let component: UpsertTenantDomainDialogComponent;
  let fixture: ComponentFixture<UpsertTenantDomainDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertTenantDomainDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertTenantDomainDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
