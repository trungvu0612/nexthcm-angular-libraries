import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyPermissionsComponent } from './formly-permissions.component';

describe('FormlyPermissionsComponent', () => {
  let component: FormlyPermissionsComponent;
  let fixture: ComponentFixture<FormlyPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyPermissionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
