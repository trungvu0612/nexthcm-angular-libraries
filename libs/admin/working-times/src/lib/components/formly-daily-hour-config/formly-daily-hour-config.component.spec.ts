import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyDailyHourConfig } from './formly-daily-hour-config.component';

describe('FormlyDailyHourConfig', () => {
  let component: FormlyDailyHourConfig;
  let fixture: ComponentFixture<FormlyDailyHourConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyDailyHourConfig],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyDailyHourConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
