import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLeaveEntitlementsExportTypeDialogComponent } from './select-leave-entitlements-export-type-dialog.component';

describe('SelectLeaveEntitlementsExportTypeDialogComponent', () => {
  let component: SelectLeaveEntitlementsExportTypeDialogComponent;
  let fixture: ComponentFixture<SelectLeaveEntitlementsExportTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectLeaveEntitlementsExportTypeDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLeaveEntitlementsExportTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
