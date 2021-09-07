import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertEmailTemplateComponent } from './upsert-email-template.component';

describe('UpsertEmailTemplateComponent', () => {
  let component: UpsertEmailTemplateComponent;
  let fixture: ComponentFixture<UpsertEmailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpsertEmailTemplateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
