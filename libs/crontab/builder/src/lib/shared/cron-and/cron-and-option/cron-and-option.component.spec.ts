import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronAndOptionComponent } from './cron-and-option.component';

describe('CronAndOptionComponent', () => {
  let component: CronAndOptionComponent;
  let fixture: ComponentFixture<CronAndOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CronAndOptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CronAndOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
