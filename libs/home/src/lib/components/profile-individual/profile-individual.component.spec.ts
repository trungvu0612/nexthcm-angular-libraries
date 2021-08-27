import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileIndividualComponent } from './profile-individual.component';

describe('ProfileIndividualComponent', () => {
  let component: ProfileIndividualComponent;
  let fixture: ComponentFixture<ProfileIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileIndividualComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
