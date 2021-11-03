import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWorkflowDialogComponent } from './view-workflow-dialog.component';

describe('ViewWorkflowDialogComponent', () => {
  let component: ViewWorkflowDialogComponent;
  let fixture: ComponentFixture<ViewWorkflowDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewWorkflowDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWorkflowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
