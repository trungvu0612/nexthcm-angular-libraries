import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMenuLeftComponent } from './admin-menu-left.component';

describe('AdminMenuLeftComponent', () => {
  let component: AdminMenuLeftComponent;
  let fixture: ComponentFixture<AdminMenuLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMenuLeftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMenuLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
