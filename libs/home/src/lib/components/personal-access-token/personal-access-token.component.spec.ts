import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccessTokenComponent } from './personal-access-token.component';

describe('ProfilePersonalAccessTokenComponent', () => {
  let component: PersonalAccessTokenComponent;
  let fixture: ComponentFixture<PersonalAccessTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalAccessTokenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalAccessTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
