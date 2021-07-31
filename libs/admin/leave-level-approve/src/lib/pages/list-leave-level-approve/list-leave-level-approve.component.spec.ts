import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLeaveLevelApproveComponent } from './list-leave-level-approve.component';

describe('ListLeaveLevelApproveComponent', () => {
  let component: ListLeaveLevelApproveComponent;
  let fixture: ComponentFixture<ListLeaveLevelApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListLeaveLevelApproveComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLeaveLevelApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
