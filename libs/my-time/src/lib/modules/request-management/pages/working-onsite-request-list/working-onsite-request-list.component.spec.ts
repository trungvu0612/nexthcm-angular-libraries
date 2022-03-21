import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingOnsiteRequestListComponent } from './working-onsite-request-list.component';

describe('WorkingOnsiteRequestListComponent', () => {
  let component: WorkingOnsiteRequestListComponent;
  let fixture: ComponentFixture<WorkingOnsiteRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingOnsiteRequestListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingOnsiteRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
