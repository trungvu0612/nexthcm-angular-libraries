import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitMapDialogComponent } from './init-map-dialog.component';

describe('CreateSeatMapComponent', () => {
  let component: InitMapDialogComponent;
  let fixture: ComponentFixture<InitMapDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InitMapDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitMapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
