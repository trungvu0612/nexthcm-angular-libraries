import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeBaseComponent } from './knowledge-base.component';

describe('PolicyComponent', () => {
  let component: KnowledgeBaseComponent;
  let fixture: ComponentFixture<KnowledgeBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnowledgeBaseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});