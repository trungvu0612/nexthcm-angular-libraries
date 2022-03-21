import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EveryoneWorkingHoursListComponent } from './everyone-working-hours-list.component';

describe('EveryoneWorkingHoursListComponent', () => {
  let component: EveryoneWorkingHoursListComponent;
  let fixture: ComponentFixture<EveryoneWorkingHoursListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EveryoneWorkingHoursListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EveryoneWorkingHoursListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
