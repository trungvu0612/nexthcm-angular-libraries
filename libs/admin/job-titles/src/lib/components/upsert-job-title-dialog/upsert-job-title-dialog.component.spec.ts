import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertJobTitleDialogComponent } from './upsert-job-title-dialog.component';

describe('UpsertJobTitleComponent', () => {
  let component: UpsertJobTitleDialogComponent;
  let fixture: ComponentFixture<UpsertJobTitleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertJobTitleDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertJobTitleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
