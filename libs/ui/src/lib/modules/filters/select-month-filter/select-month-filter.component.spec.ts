import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMonthFilterComponent } from './select-month-filter.component';

describe('FilterInputComponent', () => {
  let component: SelectMonthFilterComponent;
  let fixture: ComponentFixture<SelectMonthFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectMonthFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMonthFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
