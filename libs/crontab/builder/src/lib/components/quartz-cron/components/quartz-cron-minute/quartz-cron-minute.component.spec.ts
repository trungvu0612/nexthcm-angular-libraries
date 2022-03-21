import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartzCronMinuteComponent } from './quartz-cron-minute.component';

describe('CronMinuteComponent', () => {
  let component: QuartzCronMinuteComponent;
  let fixture: ComponentFixture<QuartzCronMinuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuartzCronMinuteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuartzCronMinuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
