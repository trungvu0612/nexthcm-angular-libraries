import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingOutsideRequestListComponent } from './working-outside-request-list.component';

describe('WorkingOutsideRequestListComponent', () => {
  let component: WorkingOutsideRequestListComponent;
  let fixture: ComponentFixture<WorkingOutsideRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingOutsideRequestListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingOutsideRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
