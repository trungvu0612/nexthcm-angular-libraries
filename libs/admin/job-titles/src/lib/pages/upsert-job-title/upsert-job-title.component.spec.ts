import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertJobTitleComponent } from './upsert-job-title.component';

describe('UpsertJobTitleComponent', () => {
  let component: UpsertJobTitleComponent;
  let fixture: ComponentFixture<UpsertJobTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertJobTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertJobTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
