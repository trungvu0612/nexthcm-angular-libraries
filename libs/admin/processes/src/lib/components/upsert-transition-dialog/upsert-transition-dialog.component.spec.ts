import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertTransitionDialogComponent } from './upsert-transition-dialog.component';

describe('UpsertTransitionDialogComponent', () => {
  let component: UpsertTransitionDialogComponent;
  let fixture: ComponentFixture<UpsertTransitionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertTransitionDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertTransitionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
