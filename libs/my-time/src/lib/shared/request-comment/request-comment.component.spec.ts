import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCommentComponent } from './request-comment.component';

describe('RequestCommentComponent', () => {
  let component: RequestCommentComponent;
  let fixture: ComponentFixture<RequestCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestCommentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
