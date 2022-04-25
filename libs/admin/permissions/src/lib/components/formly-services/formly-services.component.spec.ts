import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyServicesComponent } from './formly-services.component';

describe('FormlyServicesComponent', () => {
  let component: FormlyServicesComponent;
  let fixture: ComponentFixture<FormlyServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyServicesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
