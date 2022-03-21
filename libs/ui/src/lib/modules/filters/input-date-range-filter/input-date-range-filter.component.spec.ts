import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDateRangeFilterComponent } from './input-date-range-filter.component';

describe('InputDateRangeFilterComponent', () => {
  let component: InputDateRangeFilterComponent;
  let fixture: ComponentFixture<InputDateRangeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputDateRangeFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDateRangeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
