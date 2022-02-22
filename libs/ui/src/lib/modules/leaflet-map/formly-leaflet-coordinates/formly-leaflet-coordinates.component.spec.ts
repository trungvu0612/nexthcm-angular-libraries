import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyLeafletCoordinatesComponent } from './formly-leaflet-coordinates.component';

describe('FormlyLeafletCoordinatesComponent', () => {
  let component: FormlyLeafletCoordinatesComponent;
  let fixture: ComponentFixture<FormlyLeafletCoordinatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyLeafletCoordinatesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyLeafletCoordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
