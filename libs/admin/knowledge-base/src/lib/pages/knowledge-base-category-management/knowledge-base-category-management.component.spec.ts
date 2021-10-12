import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeBaseCategoryManagementComponent } from './knowledge-base-category-management.component';

describe('ListCategoryComponent', () => {
  let component: KnowledgeBaseCategoryManagementComponent;
  let fixture: ComponentFixture<KnowledgeBaseCategoryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnowledgeBaseCategoryManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeBaseCategoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
