import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportEmployeesDialogComponent } from './export-employees-dialog.component';

describe('ExportEmployeesDialogComponent', () => {
  let component: ExportEmployeesDialogComponent;
  let fixture: ComponentFixture<ExportEmployeesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportEmployeesDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportEmployeesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
