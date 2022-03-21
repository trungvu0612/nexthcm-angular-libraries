import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeBaseCategoriesComponent } from './knowledge-base-categories.component';

describe('KnowledgeBaseCategoriesComponent', () => {
  let component: KnowledgeBaseCategoriesComponent;
  let fixture: ComponentFixture<KnowledgeBaseCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnowledgeBaseCategoriesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeBaseCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
