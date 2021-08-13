import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWorkingOutsideRequestsComponent } from './my-working-outside-requests.component';

describe('ListWorkingOutsideComponent', () => {
  let component: MyWorkingOutsideRequestsComponent;
  let fixture: ComponentFixture<MyWorkingOutsideRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyWorkingOutsideRequestsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkingOutsideRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
