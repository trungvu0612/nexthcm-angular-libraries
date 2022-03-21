import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeeDialogComponent } from './edit-employee-dialog.component';

describe('UpsertEmployeeComponent', () => {
  let component: EditEmployeeDialogComponent;
  let fixture: ComponentFixture<EditEmployeeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEmployeeDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
