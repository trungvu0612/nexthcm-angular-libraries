import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMyRequestComponent } from './list-my-request.component';

describe('ListMyRequestComponent', () => {
  let component: ListMyRequestComponent;
  let fixture: ComponentFixture<ListMyRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListMyRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
