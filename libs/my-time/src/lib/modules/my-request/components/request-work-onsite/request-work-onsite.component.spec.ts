import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestWorkOnsiteComponent } from './request-work-onsite.component';

describe('RequestWorkOnsiteComponent', () => {
  let component: RequestWorkOnsiteComponent;
  let fixture: ComponentFixture<RequestWorkOnsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestWorkOnsiteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestWorkOnsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
