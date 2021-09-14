import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitEmployeeDialogComponent } from './init-employee-dialog.component';

describe('InitEmployeeDialogComponent', () => {
  let component: InitEmployeeDialogComponent;
  let fixture: ComponentFixture<InitEmployeeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InitEmployeeDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitEmployeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
