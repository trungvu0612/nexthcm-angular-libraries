import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestListFiltersComponent } from './request-list-filters.component';

describe('RequestListFilterComponent', () => {
  let component: RequestListFiltersComponent;
  let fixture: ComponentFixture<RequestListFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestListFiltersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestListFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
