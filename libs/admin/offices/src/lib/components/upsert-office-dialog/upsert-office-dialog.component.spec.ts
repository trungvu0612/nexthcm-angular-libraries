import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertOfficeDialogComponent } from './upsert-office-dialog.component';

describe('UpsertOfficeDialogComponent', () => {
  let component: UpsertOfficeDialogComponent;
  let fixture: ComponentFixture<UpsertOfficeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertOfficeDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertOfficeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
