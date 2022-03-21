import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeBaseArticleComponent } from './knowledge-base-article.component';

describe('KnowledgeBaseArticleComponent', () => {
  let component: KnowledgeBaseArticleComponent;
  let fixture: ComponentFixture<KnowledgeBaseArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnowledgeBaseArticleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeBaseArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
