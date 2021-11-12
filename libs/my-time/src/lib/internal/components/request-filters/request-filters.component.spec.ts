import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestFiltersComponent } from './request-filters.component';

describe('RequestFiltersComponent', () => {
  let component: RequestFiltersComponent;
  let fixture: ComponentFixture<RequestFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestFiltersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
