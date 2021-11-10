import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkingOnsiteRequestDialogComponent } from './create-working-onsite-request-dialog.component';

describe('SubmitWorkingOnsiteRequestDialogComponent', () => {
  let component: CreateWorkingOnsiteRequestDialogComponent;
  let fixture: ComponentFixture<CreateWorkingOnsiteRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateWorkingOnsiteRequestDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkingOnsiteRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
