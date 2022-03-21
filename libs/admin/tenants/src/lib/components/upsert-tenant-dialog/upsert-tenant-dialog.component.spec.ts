import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertTenantDialogComponent } from './upsert-tenant-dialog.component';

describe('UpsertTenantDialogComponent', () => {
  let component: UpsertTenantDialogComponent;
  let fixture: ComponentFixture<UpsertTenantDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertTenantDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertTenantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
