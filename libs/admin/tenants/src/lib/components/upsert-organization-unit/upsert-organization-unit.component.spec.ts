import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertOrganizationUnitComponent } from './upsert-organization-unit.component';

describe('UpsertOrganizationUnitComponent', () => {
  let component: UpsertOrganizationUnitComponent;
  let fixture: ComponentFixture<UpsertOrganizationUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertOrganizationUnitComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertOrganizationUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
