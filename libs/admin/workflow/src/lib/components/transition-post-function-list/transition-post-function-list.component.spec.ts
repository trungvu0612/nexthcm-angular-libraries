import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionPostFunctionListComponent } from './transition-post-function-list.component';

describe('TransitionPostFunctionListComponent', () => {
  let component: TransitionPostFunctionListComponent;
  let fixture: ComponentFixture<TransitionPostFunctionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransitionPostFunctionListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionPostFunctionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
