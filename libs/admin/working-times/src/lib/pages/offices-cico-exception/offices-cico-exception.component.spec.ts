import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficesCICOExceptionComponent } from './offices-cico-exception.component';

describe('OfficesCICOExceptionComponent', () => {
  let component: OfficesCICOExceptionComponent;
  let fixture: ComponentFixture<OfficesCICOExceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfficesCICOExceptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficesCICOExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
