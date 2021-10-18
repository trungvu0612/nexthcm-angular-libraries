import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeBaseCategoryComponent } from './knowledge-base-category.component';

describe('KnowledgeBaseCategoryComponent', () => {
  let component: KnowledgeBaseCategoryComponent;
  let fixture: ComponentFixture<KnowledgeBaseCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnowledgeBaseCategoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeBaseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
