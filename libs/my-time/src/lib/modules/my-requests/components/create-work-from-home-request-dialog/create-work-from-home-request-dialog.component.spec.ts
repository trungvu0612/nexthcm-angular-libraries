import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkFromHomeRequestDialogComponent } from './create-work-from-home-request-dialog.component';

describe('SubmitWorkFromHomeRequestDialogComponent', () => {
  let component: CreateWorkFromHomeRequestDialogComponent;
  let fixture: ComponentFixture<CreateWorkFromHomeRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateWorkFromHomeRequestDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkFromHomeRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
