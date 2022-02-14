import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditScheduledTaskDialogComponent } from './edit-scheduled-task-dialog.component';

describe('EditScheduledTaskDialogComponent', () => {
  let component: EditScheduledTaskDialogComponent;
  let fixture: ComponentFixture<EditScheduledTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditScheduledTaskDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditScheduledTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
