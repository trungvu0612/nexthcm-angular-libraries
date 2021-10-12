import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertKnowledgeBaseCategoryDialogComponent } from './upsert-knowledge-base-category-dialog.component';

describe('UpsertArticleCategoryDialogComponent', () => {
  let component: UpsertKnowledgeBaseCategoryDialogComponent;
  let fixture: ComponentFixture<UpsertKnowledgeBaseCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertKnowledgeBaseCategoryDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertKnowledgeBaseCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
