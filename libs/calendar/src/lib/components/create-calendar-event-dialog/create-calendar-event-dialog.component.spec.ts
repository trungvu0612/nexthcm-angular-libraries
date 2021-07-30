import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCalendarEventDialogComponent } from './create-calendar-event-dialog.component';

describe('CreateCalendarComponent', () => {
  let component: CreateCalendarEventDialogComponent;
  let fixture: ComponentFixture<CreateCalendarEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCalendarEventDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCalendarEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
