import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSeatMapDialogComponent } from './create-seat-map-dialog.component';

describe('CreateSeatMapComponent', () => {
  let component: CreateSeatMapDialogComponent;
  let fixture: ComponentFixture<CreateSeatMapDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateSeatMapDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSeatMapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
