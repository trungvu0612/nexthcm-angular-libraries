import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLeaveLevelApproveComponent } from './edit-leave-level-approve.component';

describe('EditLeaveLevelApproveComponent', () => {
  let component: EditLeaveLevelApproveComponent;
  let fixture: ComponentFixture<EditLeaveLevelApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLeaveLevelApproveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLeaveLevelApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
