import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertPeriodDialogComponent } from './upsert-period-dialog.component';

describe('UpsertPeriodDialogComponent', () => {
  let component: UpsertPeriodDialogComponent;
  let fixture: ComponentFixture<UpsertPeriodDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertPeriodDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertPeriodDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
