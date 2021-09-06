import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyUserComboBoxComponent } from './formly-user-combo-box.component';

describe('FormlyUserComboBoxComponent', () => {
  let component: FormlyUserComboBoxComponent;
  let fixture: ComponentFixture<FormlyUserComboBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormlyUserComboBoxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyUserComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
