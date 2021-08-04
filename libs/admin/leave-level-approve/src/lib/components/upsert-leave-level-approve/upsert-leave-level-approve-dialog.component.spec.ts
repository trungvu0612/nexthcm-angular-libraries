import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertLeaveLevelApproveDialogComponent } from './upsert-leave-level-approve-dialog.component';

describe('UpsertLeaveLevelApproveComponent', () => {
  let component: UpsertLeaveLevelApproveDialogComponent;
  let fixture: ComponentFixture<UpsertLeaveLevelApproveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertLeaveLevelApproveDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertLeaveLevelApproveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
