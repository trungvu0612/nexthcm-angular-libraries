import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupWorkingHoursTableComponent } from './group-working-hours-table.component';

describe('GroupWorkingHoursTableComponent', () => {
  let component: GroupWorkingHoursTableComponent;
  let fixture: ComponentFixture<GroupWorkingHoursTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupWorkingHoursTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupWorkingHoursTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
