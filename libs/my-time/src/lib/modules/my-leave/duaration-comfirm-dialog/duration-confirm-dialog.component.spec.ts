import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationConfirmDialogComponent } from './duration-confirm-dialog.component';

describe('DuarationComfirmDialogComponent', () => {
  let component: DurationConfirmDialogComponent;
  let fixture: ComponentFixture<DurationConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DurationConfirmDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
