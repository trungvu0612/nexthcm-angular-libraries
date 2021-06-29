import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedDetailComponent } from './updated-detail.component';

describe('UpdatedDetailComponent', () => {
  let component: UpdatedDetailComponent;
  let fixture: ComponentFixture<UpdatedDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatedDetailComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
