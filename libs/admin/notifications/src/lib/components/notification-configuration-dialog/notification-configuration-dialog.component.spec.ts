import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationConfigurationDialogComponent } from './notification-configuration-dialog.component';

describe('NotificationConfigurationDialogComponent', () => {
  let component: NotificationConfigurationDialogComponent;
  let fixture: ComponentFixture<NotificationConfigurationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationConfigurationDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationConfigurationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
