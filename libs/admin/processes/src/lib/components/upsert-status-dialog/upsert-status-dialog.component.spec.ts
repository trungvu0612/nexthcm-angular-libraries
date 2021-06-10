import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertStatusDialogComponent } from './upsert-status-dialog.component';

describe('AddStatusDialogComponent', () => {
  let component: UpsertStatusDialogComponent;
  let fixture: ComponentFixture<UpsertStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertStatusDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
