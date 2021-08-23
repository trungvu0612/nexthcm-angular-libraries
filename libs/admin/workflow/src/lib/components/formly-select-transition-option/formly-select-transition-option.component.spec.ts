import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlySelectTransitionOptionComponent } from './formly-select-transition-option.component';

describe('FormlySelectTransitionOptionComponent', () => {
  let component: FormlySelectTransitionOptionComponent;
  let fixture: ComponentFixture<FormlySelectTransitionOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlySelectTransitionOptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlySelectTransitionOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
