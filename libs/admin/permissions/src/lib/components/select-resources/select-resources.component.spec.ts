import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectResourcesComponent } from './select-resources.component';

describe('SelectResourcesComponent', () => {
  let component: SelectResourcesComponent;
  let fixture: ComponentFixture<SelectResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectResourcesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
