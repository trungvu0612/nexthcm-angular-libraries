import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowActionsButtonDropdownComponent } from './workflow-actions-button-dropdown.component';

describe('WorkflowActionsButtonDropdownComponent', () => {
  let component: WorkflowActionsButtonDropdownComponent;
  let fixture: ComponentFixture<WorkflowActionsButtonDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkflowActionsButtonDropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowActionsButtonDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
