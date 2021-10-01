import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedKnowledgeComponent } from './updated-knowledge.component';

describe('UpdatedDetailComponent', () => {
  let component: UpdatedKnowledgeComponent;
  let fixture: ComponentFixture<UpdatedKnowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatedKnowledgeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedKnowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
