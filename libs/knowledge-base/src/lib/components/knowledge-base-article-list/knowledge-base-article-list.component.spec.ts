import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeBaseArticleListComponent } from './knowledge-base-article-list.component';

describe('KnowledgeBaseArticleListComponent', () => {
  let component: KnowledgeBaseArticleListComponent;
  let fixture: ComponentFixture<KnowledgeBaseArticleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnowledgeBaseArticleListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeBaseArticleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
