import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertHolidayDialogComponent } from './upsert-holiday-dialog.component';

describe('UpsertHolidayComponent', () => {
  let component: UpsertHolidayDialogComponent;
  let fixture: ComponentFixture<UpsertHolidayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertHolidayDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertHolidayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
