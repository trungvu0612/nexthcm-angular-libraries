import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertEmailTemplateDialogComponent } from './upsert-email-template-dialog.component';

describe('UpsertEmailTemplateComponent', () => {
  let component: UpsertEmailTemplateDialogComponent;
  let fixture: ComponentFixture<UpsertEmailTemplateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpsertEmailTemplateDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertEmailTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
