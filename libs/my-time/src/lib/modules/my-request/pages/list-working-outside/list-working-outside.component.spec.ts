import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkingOutsideComponent } from './list-working-outside.component';

describe('ListWorkingOutsideComponent', () => {
  let component: ListWorkingOutsideComponent;
  let fixture: ComponentFixture<ListWorkingOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListWorkingOutsideComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWorkingOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
