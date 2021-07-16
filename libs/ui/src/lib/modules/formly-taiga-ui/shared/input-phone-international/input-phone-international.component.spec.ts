import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPhoneInternationalComponent } from './input-phone-international.component';

describe('InputPhoneInternationalComponent', () => {
  let component: InputPhoneInternationalComponent;
  let fixture: ComponentFixture<InputPhoneInternationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputPhoneInternationalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputPhoneInternationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
