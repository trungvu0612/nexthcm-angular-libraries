import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWorkingOnsiteRequestsComponent } from './my-working-onsite-requests.component';

describe('MyWorkingOnsiteRequestsComponent', () => {
  let component: MyWorkingOnsiteRequestsComponent;
  let fixture: ComponentFixture<MyWorkingOnsiteRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyWorkingOnsiteRequestsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkingOnsiteRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
