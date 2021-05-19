import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveSeatDialogComponent } from './move-seat-dialog.component';

describe('MoveSeatDialogComponent', () => {
  let component: MoveSeatDialogComponent;
  let fixture: ComponentFixture<MoveSeatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoveSeatDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveSeatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
