import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertUserRoleDialogComponent } from './upsert-user-role-dialog.component';

describe('UpsertUserRolesComponent', () => {
  let component: UpsertUserRoleDialogComponent;
  let fixture: ComponentFixture<UpsertUserRoleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertUserRoleDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertUserRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
