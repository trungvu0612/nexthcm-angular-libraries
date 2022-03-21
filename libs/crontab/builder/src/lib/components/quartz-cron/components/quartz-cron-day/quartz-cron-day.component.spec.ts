import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartzCronDayComponent } from './quartz-cron-day.component';

describe('CronDayComponent', () => {
  let component: QuartzCronDayComponent;
  let fixture: ComponentFixture<QuartzCronDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuartzCronDayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuartzCronDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
