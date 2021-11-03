import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyViewWorkflowButtonComponent } from './formly-view-workflow-button.component';

describe('FormlyViewWorkflowButonComponent', () => {
  let component: FormlyViewWorkflowButtonComponent;
  let fixture: ComponentFixture<FormlyViewWorkflowButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyViewWorkflowButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyViewWorkflowButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
