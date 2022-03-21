import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWorkingAfterHoursRequestsComponent } from './my-working-after-hours-requests.component';

describe('MyWorkingAfterHoursRequestsComponent', () => {
  let component: MyWorkingAfterHoursRequestsComponent;
  let fixture: ComponentFixture<MyWorkingAfterHoursRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyWorkingAfterHoursRequestsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkingAfterHoursRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
