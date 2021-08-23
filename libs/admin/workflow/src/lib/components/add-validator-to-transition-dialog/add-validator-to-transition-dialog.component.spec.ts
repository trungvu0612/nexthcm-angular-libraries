import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddValidatorToTransitionDialogComponent } from './add-validator-to-transition-dialog.component';

describe('AddValidatorToTransitionDialogComponent', () => {
  let component: AddValidatorToTransitionDialogComponent;
  let fixture: ComponentFixture<AddValidatorToTransitionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddValidatorToTransitionDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddValidatorToTransitionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
