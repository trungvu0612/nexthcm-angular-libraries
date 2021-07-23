import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingOutsiteComponent } from './working-outsite.component';

describe('WorkingOutsiteComponent', () => {
  let component: WorkingOutsiteComponent;
  let fixture: ComponentFixture<WorkingOutsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingOutsiteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingOutsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
