import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertPoliciesComponent } from './upsert-policies.component';

describe('UpsertPoliciesComponent', () => {
  let component: UpsertPoliciesComponent;
  let fixture: ComponentFixture<UpsertPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertPoliciesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
