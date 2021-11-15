import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeaveRequestDialogComponent } from './create-leave-request-dialog.component';

describe('CreateLeaveRequestDialogComponent', () => {
  let component: CreateLeaveRequestDialogComponent;
  let fixture: ComponentFixture<CreateLeaveRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateLeaveRequestDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLeaveRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
