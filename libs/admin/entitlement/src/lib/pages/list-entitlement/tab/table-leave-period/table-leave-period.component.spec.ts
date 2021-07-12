import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLeavePeriodComponent } from './table-leave-period.component';

describe('TableLeavePeriodComponent', () => {
  let component: TableLeavePeriodComponent;
  let fixture: ComponentFixture<TableLeavePeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableLeavePeriodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableLeavePeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
