import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertPermissionComponent } from './upsert-permission.component';

describe('UpsertPermissionComponent', () => {
  let component: UpsertPermissionComponent;
  let fixture: ComponentFixture<UpsertPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertPermissionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
