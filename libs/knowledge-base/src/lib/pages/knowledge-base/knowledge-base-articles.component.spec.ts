import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeBaseArticlesComponent } from './knowledge-base-articles.component';

describe('PolicyComponent', () => {
  let component: KnowledgeBaseArticlesComponent;
  let fixture: ComponentFixture<KnowledgeBaseArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnowledgeBaseArticlesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeBaseArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
