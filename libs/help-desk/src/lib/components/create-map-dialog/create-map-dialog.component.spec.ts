import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMapDialogComponent } from './create-map-dialog.component';

describe('CreateSeatMapComponent', () => {
  let component: CreateMapDialogComponent;
  let fixture: ComponentFixture<CreateMapDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateMapDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
