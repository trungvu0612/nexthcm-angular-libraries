import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatCalendarCustomComponent } from './repeat-calendar-custom.component';

describe('RepeatCalendarCustomComponent', () => {
  let component: RepeatCalendarCustomComponent;
  let fixture: ComponentFixture<RepeatCalendarCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RepeatCalendarCustomComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatCalendarCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
