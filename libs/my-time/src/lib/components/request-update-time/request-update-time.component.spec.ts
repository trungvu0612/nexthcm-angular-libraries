import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestUpdateTimeComponent } from './request-update-time.component';

describe('RequestUpdateTimeComponent', () => {
  let component: RequestUpdateTimeComponent;
  let fixture: ComponentFixture<RequestUpdateTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestUpdateTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestUpdateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
