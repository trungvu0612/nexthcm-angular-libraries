import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileShuiComponent } from './profile-shui.component';

describe('ProfileShuiComponent', () => {
  let component: ProfileShuiComponent;
  let fixture: ComponentFixture<ProfileShuiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileShuiComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileShuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
