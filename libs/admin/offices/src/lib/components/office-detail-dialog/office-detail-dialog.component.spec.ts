import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeDetailDialogComponent } from './office-detail-dialog.component';

describe('AddOfficeComponent', () => {
  let component: OfficeDetailDialogComponent;
  let fixture: ComponentFixture<OfficeDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfficeDetailDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
