import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertOrganizationalUnitComponent } from './upsert-organizational-unit.component';

describe('UpsertOrganizationUnitComponent', () => {
  let component: UpsertOrganizationalUnitComponent;
  let fixture: ComponentFixture<UpsertOrganizationalUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertOrganizationalUnitComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertOrganizationalUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
