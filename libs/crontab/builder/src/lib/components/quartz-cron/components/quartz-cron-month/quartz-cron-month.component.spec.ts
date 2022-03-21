import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartzCronMonthComponent } from './quartz-cron-month.component';

describe('CronMonthComponent', () => {
  let component: QuartzCronMonthComponent;
  let fixture: ComponentFixture<QuartzCronMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuartzCronMonthComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuartzCronMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
