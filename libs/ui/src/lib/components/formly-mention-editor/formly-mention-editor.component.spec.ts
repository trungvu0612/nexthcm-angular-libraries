import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyMentionEditorComponent } from './formly-mention-editor.component';

describe('FormlyMentionEditorComponent', () => {
  let component: FormlyMentionEditorComponent;
  let fixture: ComponentFixture<FormlyMentionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyMentionEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyMentionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
