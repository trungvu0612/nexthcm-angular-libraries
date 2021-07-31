import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlySelectJobTitleEntitlementsComponent } from './formly-select-job-title-entitlements.component';

describe('FormlySelectJobTitleEntitlementsComponent', () => {
  let component: FormlySelectJobTitleEntitlementsComponent;
  let fixture: ComponentFixture<FormlySelectJobTitleEntitlementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlySelectJobTitleEntitlementsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlySelectJobTitleEntitlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
