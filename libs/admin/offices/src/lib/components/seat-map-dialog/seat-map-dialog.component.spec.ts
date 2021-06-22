import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatMapDialogComponent } from './seat-map-dialog.component';

describe('AddFloorComponent', () => {
  let component: SeatMapDialogComponent;
  let fixture: ComponentFixture<SeatMapDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeatMapDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatMapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
