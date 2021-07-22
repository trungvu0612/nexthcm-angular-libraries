import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeBasePageComponent } from './knowledge-base-page.component';

describe('PolicyComponent', () => {
  let component: KnowledgeBasePageComponent;
  let fixture: ComponentFixture<KnowledgeBasePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnowledgeBasePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeBasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
