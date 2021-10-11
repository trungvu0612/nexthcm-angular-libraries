import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronContainerComponent } from './cron-container.component';

describe('CronContainerComponent', () => {
  let component: CronContainerComponent;
  let fixture: ComponentFixture<CronContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CronContainerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CronContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
