import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertUserRolesComponent } from './upsert-user-roles.component';

describe('UpsertUserRolesComponent', () => {
  let component: UpsertUserRolesComponent;
  let fixture: ComponentFixture<UpsertUserRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertUserRolesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertUserRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
