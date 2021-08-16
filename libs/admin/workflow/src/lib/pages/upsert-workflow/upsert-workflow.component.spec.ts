import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertWorkflowComponent } from './upsert-workflow.component';

describe('UpsertWorkflowComponent', () => {
  let component: UpsertWorkflowComponent;
  let fixture: ComponentFixture<UpsertWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertWorkflowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
