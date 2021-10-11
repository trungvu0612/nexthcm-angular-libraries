import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartzCronComponent } from './quartz-cron.component';

describe('QuartzCronComponent', () => {
  let component: QuartzCronComponent;
  let fixture: ComponentFixture<QuartzCronComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuartzCronComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuartzCronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
