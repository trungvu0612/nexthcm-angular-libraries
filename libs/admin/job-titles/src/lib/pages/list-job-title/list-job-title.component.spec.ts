import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListJobTitleComponent } from './list-job-title.component';

describe('ListJobTitleComponent', () => {
  let component: ListJobTitleComponent;
  let fixture: ComponentFixture<ListJobTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListJobTitleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListJobTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
