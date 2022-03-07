import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyAssigneeComponent } from './formly-assignee.component';

describe('FormlyDirectSupervisorComponent', () => {
  let component: FormlyAssigneeComponent;
  let fixture: ComponentFixture<FormlyAssigneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyAssigneeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyAssigneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
