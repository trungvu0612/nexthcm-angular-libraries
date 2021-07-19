import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertSeatMapComponent } from './upsert-seat-map.component';

describe('UpsertSeatMapComponent', () => {
  let component: UpsertSeatMapComponent;
  let fixture: ComponentFixture<UpsertSeatMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertSeatMapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertSeatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
