import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertContractComponent } from './upsert-contract.component';

describe('UpsertContractComponent', () => {
  let component: UpsertContractComponent;
  let fixture: ComponentFixture<UpsertContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertContractComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
