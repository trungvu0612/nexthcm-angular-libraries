import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSettingDialogComponent } from './notification-setting-dialog.component';

describe('NotificationSettingDialogComponent', () => {
  let component: NotificationSettingDialogComponent;
  let fixture: ComponentFixture<NotificationSettingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationSettingDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationSettingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
