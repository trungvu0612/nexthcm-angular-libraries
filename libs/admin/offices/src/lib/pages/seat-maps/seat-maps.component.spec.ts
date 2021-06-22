import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatMapsComponent } from './seat-maps.component';

describe('FloorsComponent', () => {
  let component: SeatMapsComponent;
  let fixture: ComponentFixture<SeatMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeatMapsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
