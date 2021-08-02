import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLeavePeriodComponent } from './edit-leave-period.component';

describe('EditLeavePeriodComponent', () => {
  let component: EditLeavePeriodComponent;
  let fixture: ComponentFixture<EditLeavePeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLeavePeriodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLeavePeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
