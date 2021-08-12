import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlyMeWorkingHoursListComponent } from './only-me-working-hours-list.component';

describe('OnlyMeWorkingHoursListComponent', () => {
  let component: OnlyMeWorkingHoursListComponent;
  let fixture: ComponentFixture<OnlyMeWorkingHoursListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnlyMeWorkingHoursListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlyMeWorkingHoursListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
