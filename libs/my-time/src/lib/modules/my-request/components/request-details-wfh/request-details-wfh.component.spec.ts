import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDetailsWfhComponent } from './request-details-wfh.component';

describe('RequestDetailsWfhComponent', () => {
  let component: RequestDetailsWfhComponent;
  let fixture: ComponentFixture<RequestDetailsWfhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestDetailsWfhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDetailsWfhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
