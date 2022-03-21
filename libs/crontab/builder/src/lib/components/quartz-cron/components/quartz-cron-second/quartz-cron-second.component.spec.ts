import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartzCronSecondComponent } from './quartz-cron-second.component';

describe('CronSecondComponent', () => {
  let component: QuartzCronSecondComponent;
  let fixture: ComponentFixture<QuartzCronSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuartzCronSecondComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuartzCronSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
