import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyQuillTemplateVariableComponent } from './formly-quill-template-variable.component';

describe('FormlyQuillTemplateVariableComponent', () => {
  let component: FormlyQuillTemplateVariableComponent;
  let fixture: ComponentFixture<FormlyQuillTemplateVariableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormlyQuillTemplateVariableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyQuillTemplateVariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
