import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartzCronYearComponent } from './quartz-cron-year.component';

describe('QuartzCronYearComponent', () => {
  let component: QuartzCronYearComponent;
  let fixture: ComponentFixture<QuartzCronYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuartzCronYearComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuartzCronYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
