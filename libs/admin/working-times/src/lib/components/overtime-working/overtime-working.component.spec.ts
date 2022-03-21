import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeWorkingComponent } from './overtime-working.component';

describe('OvertimeWorkingComponent', () => {
  let component: OvertimeWorkingComponent;
  let fixture: ComponentFixture<OvertimeWorkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OvertimeWorkingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeWorkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
