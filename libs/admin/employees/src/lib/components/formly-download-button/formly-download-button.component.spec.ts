import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyDownloadButtonComponent } from './formly-download-button.component';

describe('FormlyDownloadButtonComponent', () => {
  let component: FormlyDownloadButtonComponent;
  let fixture: ComponentFixture<FormlyDownloadButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyDownloadButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyDownloadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
