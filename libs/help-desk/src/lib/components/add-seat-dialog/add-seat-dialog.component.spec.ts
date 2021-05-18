import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeatDialogComponent } from './add-seat-dialog.component';

describe('AddSeatDialogComponent', () => {
  let component: AddSeatDialogComponent;
  let fixture: ComponentFixture<AddSeatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSeatDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSeatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
