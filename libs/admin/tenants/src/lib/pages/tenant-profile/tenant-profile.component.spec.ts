import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantProfileComponent } from './tenant-profile.component';

describe('ProfileComponent', () => {
  let component: TenantProfileComponent;
  let fixture: ComponentFixture<TenantProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantProfileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
