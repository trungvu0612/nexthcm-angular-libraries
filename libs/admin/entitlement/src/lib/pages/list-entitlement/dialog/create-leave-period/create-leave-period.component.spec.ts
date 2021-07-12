import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeavePeriodComponent } from './create-leave-period.component';

describe('CreateLeavePeriodComponent', () => {
  let component: CreateLeavePeriodComponent;
  let fixture: ComponentFixture<CreateLeavePeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLeavePeriodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLeavePeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
