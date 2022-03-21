import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinCheckoutExceptionComponent } from './checkin-checkout-exception.component';

describe('CheckinCheckoutExceptionComponent', () => {
  let component: CheckinCheckoutExceptionComponent;
  let fixture: ComponentFixture<CheckinCheckoutExceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckinCheckoutExceptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinCheckoutExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
