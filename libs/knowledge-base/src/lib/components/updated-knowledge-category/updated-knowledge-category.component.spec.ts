import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedKnowledgeCategoryComponent } from './updated-knowledge-category.component';

describe('UpdatedKnowledgeCategoryComponent', () => {
  let component: UpdatedKnowledgeCategoryComponent;
  let fixture: ComponentFixture<UpdatedKnowledgeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatedKnowledgeCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedKnowledgeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
