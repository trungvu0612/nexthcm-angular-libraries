import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuiFormComponent } from './shui-form.component';

describe('ShuiFormComponent', () => {
  let component: ShuiFormComponent;
  let fixture: ComponentFixture<ShuiFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShuiFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShuiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
