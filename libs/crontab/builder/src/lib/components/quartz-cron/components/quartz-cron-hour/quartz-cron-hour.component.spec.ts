import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartzCronHourComponent } from './quartz-cron-hour.component';

describe('CronHourComponent', () => {
  let component: QuartzCronHourComponent;
  let fixture: ComponentFixture<QuartzCronHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuartzCronHourComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuartzCronHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
