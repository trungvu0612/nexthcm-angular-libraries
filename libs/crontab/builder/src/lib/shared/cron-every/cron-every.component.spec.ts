import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronEveryComponent } from './cron-every.component';

describe('CronEveryComponent', () => {
  let component: CronEveryComponent;
  let fixture: ComponentFixture<CronEveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CronEveryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CronEveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
