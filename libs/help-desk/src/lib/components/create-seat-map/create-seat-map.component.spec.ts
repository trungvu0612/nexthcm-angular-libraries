import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSeatMapComponent } from './create-seat-map.component';

describe('CreateSeatMapComponent', () => {
  let component: CreateSeatMapComponent;
  let fixture: ComponentFixture<CreateSeatMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateSeatMapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSeatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
