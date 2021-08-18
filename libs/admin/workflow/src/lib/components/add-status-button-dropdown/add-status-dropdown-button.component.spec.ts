import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStatusDropdownButtonComponent } from './add-status-dropdown-button.component';

describe('AddStatusButtonDropdownComponent', () => {
  let component: AddStatusDropdownButtonComponent;
  let fixture: ComponentFixture<AddStatusDropdownButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddStatusDropdownButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStatusDropdownButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
