import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyQuillTemplateVariablesComponent } from './formly-quill-template-variables.component';

describe('FormlyQuillTemplateVariablesComponent', () => {
  let component: FormlyQuillTemplateVariablesComponent;
  let fixture: ComponentFixture<FormlyQuillTemplateVariablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyQuillTemplateVariablesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyQuillTemplateVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
