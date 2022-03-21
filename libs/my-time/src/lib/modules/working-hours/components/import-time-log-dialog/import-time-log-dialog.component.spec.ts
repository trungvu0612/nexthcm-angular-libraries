import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTimeLogDialogComponent } from './import-time-log-dialog.component';

describe('ImportTimeLogDialogComponent', () => {
  let component: ImportTimeLogDialogComponent;
  let fixture: ComponentFixture<ImportTimeLogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportTimeLogDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTimeLogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
