import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertKnowledgeBaseArticleComponent } from './upsert-knowledge-base-article.component';

describe('UpsertArticleDialogComponent', () => {
  let component: UpsertKnowledgeBaseArticleComponent;
  let fixture: ComponentFixture<UpsertKnowledgeBaseArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertKnowledgeBaseArticleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertKnowledgeBaseArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
