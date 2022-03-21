import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkingOnsiteRequestComponent } from './create-working-onsite-request.component';

describe('CreateWorkingOnsiteRequestComponent', () => {
  let component: CreateWorkingOnsiteRequestComponent;
  let fixture: ComponentFixture<CreateWorkingOnsiteRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateWorkingOnsiteRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkingOnsiteRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
