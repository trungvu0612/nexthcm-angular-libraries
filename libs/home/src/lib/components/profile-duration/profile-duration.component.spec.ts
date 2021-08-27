import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDurationComponent } from './profile-duration.component';

describe('ProfileDurationComponent', () => {
  let component: ProfileDurationComponent;
  let fixture: ComponentFixture<ProfileDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileDurationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
