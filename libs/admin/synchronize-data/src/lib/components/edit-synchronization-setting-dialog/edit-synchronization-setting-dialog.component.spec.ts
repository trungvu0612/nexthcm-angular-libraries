import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSynchronizationSettingDialogComponent } from './edit-synchronization-setting-dialog.component';

describe('EditSynchronizationSettingDialogComponent', () => {
  let component: EditSynchronizationSettingDialogComponent;
  let fixture: ComponentFixture<EditSynchronizationSettingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSynchronizationSettingDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSynchronizationSettingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
