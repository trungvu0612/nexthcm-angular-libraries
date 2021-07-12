import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlySelectPermissionsComponent } from './formly-select-permissions.component';

describe('FormlySelectPermissionsComponent', () => {
  let component: FormlySelectPermissionsComponent;
  let fixture: ComponentFixture<FormlySelectPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlySelectPermissionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlySelectPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
