import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BvCalendarComponent } from './bv-calendar.component';

describe('BvCalendarComponent', () => {
  let component: BvCalendarComponent;
  let fixture: ComponentFixture<BvCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BvCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BvCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
