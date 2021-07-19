import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertPolicyComponent } from './upsert-policy.component';

describe('UpsertPoliciesComponent', () => {
  let component: UpsertPolicyComponent;
  let fixture: ComponentFixture<UpsertPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertPolicyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
