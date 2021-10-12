import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeBaseArticleManagementComponent } from './knowledge-base-article-management.component';

describe('ListPoliciesComponent', () => {
  let component: KnowledgeBaseArticleManagementComponent;
  let fixture: ComponentFixture<KnowledgeBaseArticleManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnowledgeBaseArticleManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeBaseArticleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
