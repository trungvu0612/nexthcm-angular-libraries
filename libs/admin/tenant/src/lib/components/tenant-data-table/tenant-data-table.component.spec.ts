import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantDataTableComponent } from './tenant-data-table.component';

describe('TenantDataTableComponent', () => {
  let component: TenantDataTableComponent;
  let fixture: ComponentFixture<TenantDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantDataTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
