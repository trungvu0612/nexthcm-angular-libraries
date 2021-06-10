import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertProcessComponent } from './upsert-process.component';

describe('UpsertWorkflowComponent', () => {
  let component: UpsertProcessComponent;
  let fixture: ComponentFixture<UpsertProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertProcessComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
