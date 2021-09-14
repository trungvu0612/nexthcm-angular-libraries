import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestConfigFormComponent } from './request-config-form.component';

describe('RequestConfigFormComponent', () => {
  let component: RequestConfigFormComponent;
  let fixture: ComponentFixture<RequestConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestConfigFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
