import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOtRequestComponent } from './list-ot-request.component';

describe('ListOtRequestComponent', () => {
  let component: ListOtRequestComponent;
  let fixture: ComponentFixture<ListOtRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListOtRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOtRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
