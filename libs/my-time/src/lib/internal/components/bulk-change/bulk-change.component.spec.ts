import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkChangeComponent } from './bulk-change.component';

describe('BulkChangeComponent', () => {
  let component: BulkChangeComponent;
  let fixture: ComponentFixture<BulkChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BulkChangeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
