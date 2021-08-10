import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkingHoursComponent } from "./working-hours.component";

describe('WorkingHourComponent', () => {
  let component: WorkingHoursComponent;
  let fixture: ComponentFixture<WorkingHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingHoursComponent]
    })
      .compileComponents();
    [WorkingHoursComponent],
  }).compileComponents();
});

beforeEach(() => {
  fixture = TestBed.createComponent(WorkingHoursComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
});

it('should create', () => {
  expect(component).toBeTruthy();
});
})
