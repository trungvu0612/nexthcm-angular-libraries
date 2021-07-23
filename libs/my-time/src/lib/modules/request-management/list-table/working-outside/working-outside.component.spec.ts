import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingOutsideComponent } from './working-outside.component';

describe('WorkingOutsideComponent', () => {
  let component: WorkingOutsideComponent;
  let fixture: ComponentFixture<WorkingOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingOutsideComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
