import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitWorkflowDialogComponent } from './init-workflow-dialog.component';

describe('CreateProcessDialogComponent', () => {
  let component: InitWorkflowDialogComponent;
  let fixture: ComponentFixture<InitWorkflowDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InitWorkflowDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitWorkflowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
