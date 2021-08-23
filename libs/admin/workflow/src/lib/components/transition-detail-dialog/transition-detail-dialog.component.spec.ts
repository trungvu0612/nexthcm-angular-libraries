import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionDetailDialogComponent } from './transition-detail-dialog.component';

describe('TransitionDetailDialogComponent', () => {
  let component: TransitionDetailDialogComponent;
  let fixture: ComponentFixture<TransitionDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransitionDetailDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
