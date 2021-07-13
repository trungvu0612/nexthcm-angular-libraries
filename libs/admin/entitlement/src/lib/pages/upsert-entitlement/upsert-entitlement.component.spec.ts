import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertEntitlementComponent } from './upsert-entitlement.component';

describe('UpsertEntitlementComponent', () => {
  let component: UpsertEntitlementComponent;
  let fixture: ComponentFixture<UpsertEntitlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertEntitlementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertEntitlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
