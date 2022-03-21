import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportTimeLogDialogComponent } from './export-time-log-dialog.component';

describe('ExportTimelogDialogComponent', () => {
  let component: ExportTimeLogDialogComponent;
  let fixture: ComponentFixture<ExportTimeLogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportTimeLogDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportTimeLogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
