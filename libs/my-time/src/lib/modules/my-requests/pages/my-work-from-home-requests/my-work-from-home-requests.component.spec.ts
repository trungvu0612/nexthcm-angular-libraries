import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWorkFromHomeRequestsComponent } from './my-work-from-home-requests.component';

describe('MyWorkFromHomeRequestsComponent', () => {
  let component: MyWorkFromHomeRequestsComponent;
  let fixture: ComponentFixture<MyWorkFromHomeRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyWorkFromHomeRequestsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkFromHomeRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
