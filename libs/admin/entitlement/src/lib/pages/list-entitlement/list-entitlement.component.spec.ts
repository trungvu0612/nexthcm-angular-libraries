import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEntitlementComponent } from './list-entitlement.component';

describe('ListEntitlementComponent', () => {
  let component: ListEntitlementComponent;
  let fixture: ComponentFixture<ListEntitlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEntitlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEntitlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
