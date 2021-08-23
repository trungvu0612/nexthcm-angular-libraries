import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionConditionListComponent } from './transition-condition-list.component';

describe('TransitionConditionsComponent', () => {
  let component: TransitionConditionListComponent;
  let fixture: ComponentFixture<TransitionConditionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransitionConditionListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionConditionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
