import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlySelectOrgTreeComponent } from './formly-select-org-tree.component';

describe('FormlySelectOrgTreeComponent', () => {
  let component: FormlySelectOrgTreeComponent;
  let fixture: ComponentFixture<FormlySelectOrgTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlySelectOrgTreeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlySelectOrgTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
