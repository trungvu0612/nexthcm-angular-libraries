import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeDataTableComponent } from './time-data-table.component';

describe('TimeDataTableComponent', () => {
  let component: TimeDataTableComponent;
  let fixture: ComponentFixture<TimeDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeDataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
