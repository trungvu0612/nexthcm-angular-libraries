import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConditionToTransitionDialogComponent } from './add-condition-to-transition-dialog.component';

describe('AddConditionToTransitionDialogComponent', () => {
  let component: AddConditionToTransitionDialogComponent;
  let fixture: ComponentFixture<AddConditionToTransitionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddConditionToTransitionDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConditionToTransitionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
