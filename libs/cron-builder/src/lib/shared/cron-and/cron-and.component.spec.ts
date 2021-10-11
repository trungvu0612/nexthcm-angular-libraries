import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronAndComponent } from './cron-and.component';

describe('CronAndComponent', () => {
  let component: CronAndComponent;
  let fixture: ComponentFixture<CronAndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CronAndComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CronAndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
