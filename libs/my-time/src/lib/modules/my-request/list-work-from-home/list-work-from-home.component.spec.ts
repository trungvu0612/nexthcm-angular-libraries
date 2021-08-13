import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkFromHomeComponent } from './list-work-from-home.component';

describe('ListWorkFromHomeComponent', () => {
  let component: ListWorkFromHomeComponent;
  let fixture: ComponentFixture<ListWorkFromHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListWorkFromHomeComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWorkFromHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
