import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractColDayRangeComponent } from './abstract-col-day-range.component';

describe('AbstractColDayRangeComponent', () => {
  let component: AbstractColDayRangeComponent;
  let fixture: ComponentFixture<AbstractColDayRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbstractColDayRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractColDayRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
