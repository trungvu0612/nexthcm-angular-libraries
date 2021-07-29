import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlySelectJobTitlesComponent } from './formly-select-job-titles.component';

describe('FormlySelectJobTitlesComponent', () => {
  let component: FormlySelectJobTitlesComponent;
  let fixture: ComponentFixture<FormlySelectJobTitlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormlySelectJobTitlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlySelectJobTitlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
