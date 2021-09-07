import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateManagementComponent } from './email-template-management.component';

describe('EmailTemplatesComponent', () => {
  let component: EmailTemplateManagementComponent;
  let fixture: ComponentFixture<EmailTemplateManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmailTemplateManagementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
