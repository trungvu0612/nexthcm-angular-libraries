import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertBranchComponent } from './upsert-branch.component';

describe('UpsertBranchComponent', () => {
  let component: UpsertBranchComponent;
  let fixture: ComponentFixture<UpsertBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertBranchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
