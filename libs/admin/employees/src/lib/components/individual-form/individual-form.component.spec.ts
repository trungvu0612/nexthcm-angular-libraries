import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualFormComponent } from './individual-form.component';

describe('IndividualChildFormComponent', () => {
  let component: IndividualFormComponent;
  let fixture: ComponentFixture<IndividualFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
