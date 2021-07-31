import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertLeaveLevelApproveComponent } from './upsert-leave-level-approve.component';

describe('UpsertLeaveLevelApproveComponent', () => {
  let component: UpsertLeaveLevelApproveComponent;
  let fixture: ComponentFixture<UpsertLeaveLevelApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertLeaveLevelApproveComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertLeaveLevelApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
