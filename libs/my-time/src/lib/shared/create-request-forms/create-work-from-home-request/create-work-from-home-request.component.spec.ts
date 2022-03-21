import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkFromHomeRequestComponent } from './create-work-from-home-request.component';

describe('CreateWorkFromHomeRequestComponent', () => {
  let component: CreateWorkFromHomeRequestComponent;
  let fixture: ComponentFixture<CreateWorkFromHomeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateWorkFromHomeRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkFromHomeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
