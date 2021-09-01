import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostFunctionToTransitionDialogComponent } from './add-post-function-to-transition-dialog.component';

describe('AddPostFunctionToTransitionDialogComponent', () => {
  let component: AddPostFunctionToTransitionDialogComponent;
  let fixture: ComponentFixture<AddPostFunctionToTransitionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPostFunctionToTransitionDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPostFunctionToTransitionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
