import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldLabelOutsideComponent } from './form-field-label-outside.component';

describe('FormFieldLabelOutsideComponent', () => {
  let component: FormFieldLabelOutsideComponent;
  let fixture: ComponentFixture<FormFieldLabelOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormFieldLabelOutsideComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldLabelOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
