import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFormHomeRequestListComponent } from './work-form-home-request-list.component';

describe('WorkFormHomeRequestListComponent', () => {
  let component: WorkFormHomeRequestListComponent;
  let fixture: ComponentFixture<WorkFormHomeRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkFormHomeRequestListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFormHomeRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
