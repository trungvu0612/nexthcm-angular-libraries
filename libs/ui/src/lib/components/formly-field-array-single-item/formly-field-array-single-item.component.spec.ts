import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyFieldArraySingleItemComponent } from './formly-field-array-single-item.component';

describe('FormlyArraySingleItemComponent', () => {
  let component: FormlyFieldArraySingleItemComponent;
  let fixture: ComponentFixture<FormlyFieldArraySingleItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyFieldArraySingleItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyFieldArraySingleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
