import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowStatusComboBoxFilterComponent } from './workflow-status-combo-box-filter.component';

describe('ComboBoxFilterComponent', () => {
  let component: WorkflowStatusComboBoxFilterComponent;
  let fixture: ComponentFixture<WorkflowStatusComboBoxFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkflowStatusComboBoxFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowStatusComboBoxFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
