import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertTenantFormComponent } from './upsert-tenant-form.component';

describe('UpsertTenantFormComponent', () => {
  let component: UpsertTenantFormComponent;
  let fixture: ComponentFixture<UpsertTenantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertTenantFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertTenantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
