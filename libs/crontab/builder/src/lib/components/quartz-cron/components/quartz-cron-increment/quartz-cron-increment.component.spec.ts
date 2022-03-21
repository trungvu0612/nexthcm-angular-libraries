import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartzCronIncrementComponent } from './quartz-cron-increment.component';

describe('CronIncrementComponent', () => {
  let component: QuartzCronIncrementComponent;
  let fixture: ComponentFixture<QuartzCronIncrementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuartzCronIncrementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuartzCronIncrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
