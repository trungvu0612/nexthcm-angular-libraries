import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionValidatorListComponent } from './transition-validator-list.component';

describe('TransitionValidatorListComponent', () => {
  let component: TransitionValidatorListComponent;
  let fixture: ComponentFixture<TransitionValidatorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransitionValidatorListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionValidatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
