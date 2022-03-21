import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyStatusToggleComponent } from './formly-status-toggle.component';

describe('FormlyStatusToggleComponent', () => {
  let component: FormlyStatusToggleComponent;
  let fixture: ComponentFixture<FormlyStatusToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyStatusToggleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyStatusToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
