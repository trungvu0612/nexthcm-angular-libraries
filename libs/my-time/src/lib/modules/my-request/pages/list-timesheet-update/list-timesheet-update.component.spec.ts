import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTimesheetUpdateComponent } from './list-timesheet-update.component';

describe('ListTimesheetUpdateComponent', () => {
  let component: ListTimesheetUpdateComponent;
  let fixture: ComponentFixture<ListTimesheetUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListTimesheetUpdateComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTimesheetUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
