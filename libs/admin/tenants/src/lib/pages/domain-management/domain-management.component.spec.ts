import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainManagementComponent } from './domain-management.component';

describe('DomainManagementComponent', () => {
  let component: DomainManagementComponent;
  let fixture: ComponentFixture<DomainManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DomainManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
