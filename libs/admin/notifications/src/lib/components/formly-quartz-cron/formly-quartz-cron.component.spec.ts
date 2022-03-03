import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyQuartzCronComponent } from './formly-quartz-cron.component';

describe('FormlyQuartzCronComponent', () => {
  let component: FormlyQuartzCronComponent;
  let fixture: ComponentFixture<FormlyQuartzCronComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyQuartzCronComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyQuartzCronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
