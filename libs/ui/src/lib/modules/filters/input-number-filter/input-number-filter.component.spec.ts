import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputNumberFilterComponent } from './input-number-filter.component';

describe('InputNumberFilterComponent', () => {
  let component: InputNumberFilterComponent;
  let fixture: ComponentFixture<InputNumberFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputNumberFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputNumberFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
