import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatMapManagementComponent } from './seat-map-management.component';

describe('SeatMapListComponent', () => {
  let component: SeatMapManagementComponent;
  let fixture: ComponentFixture<SeatMapManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeatMapManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatMapManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
