import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatMapListComponent } from './seat-map-list.component';

describe('SeatMapListComponent', () => {
  let component: SeatMapListComponent;
  let fixture: ComponentFixture<SeatMapListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeatMapListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatMapListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
