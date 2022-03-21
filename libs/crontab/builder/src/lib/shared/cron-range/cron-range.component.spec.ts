import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronRangeComponent } from './cron-range.component';

describe('CronRangeComponent', () => {
  let component: CronRangeComponent;
  let fixture: ComponentFixture<CronRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CronRangeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CronRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
